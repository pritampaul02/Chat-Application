import { Users } from "../model/user.model.js";
import { Messages } from "../model/message.model.js";
import { getSocketId, io } from "../socket/socket.js";
import { date } from "zod";

class MessageService {
    sendMessage = async (id, body) => {
        const sender = await Users.findById(id);
        const receiver = await Users.findById(body.receiver);

        if (!sender || !receiver) {
            throw new Error("User not found");
        }

        const receiverSocketId = getSocketId(body.receiver);
        const senderSocketId = getSocketId(id);

        const isReceiverOnline = !!receiverSocketId;
        const initialStatus = isReceiverOnline ? "delivered" : "sent";
        const deliveredAt = isReceiverOnline ? new Date() : null;

        const messageData = {
            sender: id,
            receiver: body.receiver,
            receiverModel: body.receiverModel,
            message: body.message || "",
            status: initialStatus,
            deliveredAt,
            isRead: false,
        };

        if (body.image) {
            messageData.image = body.image;
            messageData.imageId = body.imageId;
        }

        const newMessage = await Messages.create(messageData);

        sender.lastMessage = {
            type: "sender",
            isRead: false,
            editedAt: newMessage.editedAt,
            createdAt: newMessage.createdAt,
            message: body.message,
        };
        receiver.lastMessage = {
            type: "receiver",
            isRead: false,
            editedAt: newMessage.editedAt,
            createdAt: newMessage.createdAt,
            message: body.message,
        };
        await sender.save();
        await receiver.save();

        const chat = await Messages.findById(newMessage._id)
            .populate("sender", "name profile_pic _id email")
            .populate("receiver", "name profile_pic _id email");

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("send-message", {
                receiverId: body.receiver,
                chat,
            });
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("meg-sent", { sender: id, chat });
            if (isReceiverOnline) {
                io.to(senderSocketId).emit("message:status-update", {
                    messageId: chat._id,
                    status: "delivered",
                    deliveredAt,
                });
            }
        }

        return chat;
    };

    markMessagesAsRead = async (userId, senderId) => {
        const now = new Date();
        const updated = await Messages.updateMany(
            {
                sender: senderId,
                receiver: userId,
                $or: [
                    { isRead: false },
                    { status: { $in: ["sent", "delivered"] } },
                ],
            },
            {
                $set: {
                    status: "read",
                    isRead: true,
                    readAt: now,
                },
            }
        );

        await Users.findByIdAndUpdate(userId, { "lastMessage.isRead": true });
        await Users.findByIdAndUpdate(senderId, { "lastMessage.isRead": true });

        const senderSocketId = getSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messages:read", {
                readerId: userId,
                senderId: senderId,
                readAt: now,
            });
        }

        const readerSocketId = getSocketId(userId);
        if (readerSocketId) {
            io.to(readerSocketId).emit("messages:read", {
                readerId: userId,
                senderId: senderId,
                readAt: now,
            });
        }

        return { success: true, count: updated.modifiedCount };
    };

    markMessagesAsDelivered = async (userId) => {
        const now = new Date();
        const pendingMessages = await Messages.find({
            receiver: userId,
            status: "sent",
        }).select("_id sender");

        if (!pendingMessages || pendingMessages.length === 0) return;

        await Messages.updateMany(
            { receiver: userId, status: "sent" },
            { $set: { status: "delivered", deliveredAt: now } }
        );

        const senderMap = {};
        for (const msg of pendingMessages) {
            const sId = msg.sender.toString();
            if (!senderMap[sId]) senderMap[sId] = [];
            senderMap[sId].push(msg._id);
        }

        for (const [sId, messageIds] of Object.entries(senderMap)) {
            const sSocket = getSocketId(sId);
            if (sSocket) {
                io.to(sSocket).emit("messages:delivered", {
                    receiverId: userId,
                    messageIds,
                    deliveredAt: now,
                });
            }
        }
    };

    fetchMessage = async (id, receiverId) => {
        const sender = await Users.findById(id);
        const reciver = await Users.findById(receiverId);

        // console.log("sender , reciver", reciver);

        if (!sender && !reciver) {
            throw new Error("User not found");
        }

        const messages = await Messages.find({
            $or: [
                { sender: id, receiver: receiverId },
                { sender: receiverId, receiver: id },
            ],
        })
            .populate("sender", "name profile_pic _id email")
            .populate("receiver", "name profile_pic _id email")
            .populate("reactions.user", "name profile_pic _id ");

        return messages;
    };

    editMessage = async (userId, messageId, text) => {
        const message = await Messages.findById(messageId);
        if (!message || message.sender.toString() !== userId) {
            throw new Error("You are not authorized to edit this message");
        }

        if (message.deleted) {
            throw new Error("You cannot edit a deleted message");
        }

        message.message = text;
        message.edited = true;
        message.editedAt = Date.now();
        await message.save();

        // Refetch the updated and populated message
        const updatedChat = await Messages.findById(message._id)
            .populate("sender", "name profile_pic _id email")
            .populate("receiver", "name profile_pic _id email");

        const receiverSocketId = getSocketId(message.receiver);
        const senderSocketId = getSocketId(message.sender);

        // Emit updated message to receiver
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message:updated", {
                receiverId: message.receiver,
                chat: updatedChat,
            });
        }

        // Emit updated message to sender as well
        if (senderSocketId) {
            io.to(senderSocketId).emit("message:updated", {
                receiverId: message.receiver,
                chat: updatedChat,
            });
        }

        return updatedChat;
    };

    deleteMessage = async (userId, messageId) => {
        const message = await Messages.findById(messageId);
        if (!message || message.sender.toString() !== userId) {
            throw new Error("You are not authorized to delete this message");
        }

        message.deleted = true;
        message.message = "This message was deleted";
        await message.save();

        // Refetch the updated and populated message
        const updatedChat = await Messages.findById(message._id)
            .populate("sender", "name profile_pic _id email")
            .populate("receiver", "name profile_pic _id email");

        const receiverSocketId = getSocketId(message.receiver);
        const senderSocketId = getSocketId(message.sender);

        // Emit updated message to receiver
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message:deleted", {
                receiverId: message.receiver,
                chat: updatedChat,
            });
        }

        // Emit updated message to sender as well
        if (senderSocketId) {
            io.to(senderSocketId).emit("message:deleted", {
                receiverId: message.receiver,
                chat: updatedChat,
            });
        }

        return updatedChat;
    };

    reactToMessage = async (userId, messageId, emoji) => {
        const message = await Messages.findById(messageId);
        if (!message) throw new Error("Message not found");
        if (message.deleted) throw new Error("message not found");

        message.reactions = message.reactions.filter(
            (r) => r.user.toString() !== userId
        );

        // Add the new emoji
        message.reactions.push({ user: userId, emoji });

        await message.save();

        const updatedChat = await Messages.findById(message._id)
            .populate("sender", "name profile_pic _id email")
            .populate("receiver", "name profile_pic _id email");

        const receiverSocketId = getSocketId(message.receiver);
        const senderSocketId = getSocketId(message.sender);

        // Emit updated message to receiver
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message:reacted", {
                receiverId: message.receiver,
                chat: updatedChat,
            });
        }

        // Emit updated message to sender as well
        if (senderSocketId) {
            io.to(senderSocketId).emit("message:reacted", {
                receiverId: message.receiver,
                chat: updatedChat,
            });
        }
        return updatedChat;
    };
    UpdateReactToMessage = async (userId, messageId, emoji) => {
        const message = await Messages.findById(messageId);
        if (!message) throw new Error("Message not found");
        if (message.deleted) throw new Error("Message is deleted");

        // Remove any existing reaction from the same user
        message.reactions = message.reactions.filter(
            (r) => r.user.toString() !== userId
        );

        // Add the new reaction
        message.reactions.push({ user: userId, emoji });

        await message.save();

        io.to(getSocketId(message.receiver)).emit("message:reacted", {
            type: "reaction-update",
            messageId,
            emoji,
            userId,
        });
        return message;
    };
    deleteReactToMessage = async (userId, messageId, emoji) => {
        const message = await Messages.findById(messageId);
        if (!message) throw new Error("Message not found");
        if (message.deleted) throw new Error("Message is deleted");

        // Check if the user has reacted with this emoji
        const reaction = message.reactions.find(
            (r) => r.user.toString() === userId && r.emoji === emoji
        );

        if (!reaction) {
            throw new Error(
                "You are not authorized to delete this reaction or reaction not found"
            );
        }

        // Remove the reaction
        message.reactions = message.reactions.filter(
            (r) => !(r.user.toString() === userId && r.emoji === emoji)
        );

        await message.save();
        const updatedChat = await Messages.findById(message._id)
            .populate("sender", "name profile_pic _id email")
            .populate("receiver", "name profile_pic _id email");

        const receiverSocketId = getSocketId(message.receiver);
        const senderSocketId = getSocketId(message.sender);

        // Emit updated message to receiver
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message:deletedReact", {
                receiverId: message.receiver,
                chat: updatedChat,
            });
        }

        // Emit updated message to sender as well
        if (senderSocketId) {
            io.to(senderSocketId).emit("message:deletedReact", {
                receiverId: message.receiver,
                chat: updatedChat,
            });
        }
        return updatedChat;
    };
}

export default new MessageService();

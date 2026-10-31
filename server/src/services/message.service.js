import { Users } from "../model/user.model.js";
import { Messages } from "../model/message.model.js";
import { getSocketId, io } from "../socket/socket.js";

class MessageService {
    sendMessage = async (id, body) => {
        const receiverId = body.receiver || body.receiverId;
        if (!receiverId) {
            throw new Error("Receiver ID is required");
        }

        // Parallel check/fetch for receiver and sender
        const [sender, receiver] = await Promise.all([
            Users.findById(id).select("name profile_pic email").lean(),
            Users.findById(receiverId).select("name profile_pic email").lean(),
        ]);

        if (!sender || !receiver) {
            throw new Error("User not found");
        }

        const receiverSocketId = getSocketId(receiverId);
        const senderSocketId = getSocketId(id);

        const isReceiverOnline = !!receiverSocketId;
        const initialStatus = isReceiverOnline ? "delivered" : "sent";
        const deliveredAt = isReceiverOnline ? new Date() : null;

        const messageData = {
            sender: id,
            receiver: receiverId,
            receiverModel: body.receiverModel || "user",
            message: body.message || "",
            status: initialStatus,
            deliveredAt,
            isRead: false,
        };

        if (body.image) {
            messageData.image = body.image;
            messageData.imageId = body.imageId;
        }

        // Create message in DB
        const createdMessage = await Messages.create(messageData);

        const lastMessagePayload = {
            type: "sender",
            isRead: false,
            editedAt: createdMessage.editedAt,
            createdAt: createdMessage.createdAt,
            message: body.message || (body.image ? "📷 Photo" : ""),
        };

        // Update sender and receiver lastMessage concurrently in background/parallel
        const updateUsersPromise = Promise.all([
            Users.findByIdAndUpdate(id, {
                lastMessage: { ...lastMessagePayload, type: "sender" },
            }),
            Users.findByIdAndUpdate(receiverId, {
                lastMessage: { ...lastMessagePayload, type: "receiver" },
            }),
        ]);

        // Populate the created message without refetching from DB
        const populatedChat = await createdMessage.populate([
            { path: "sender", select: "name profile_pic _id email" },
            { path: "receiver", select: "name profile_pic _id email" },
        ]);

        const chat = populatedChat.toObject ? populatedChat.toObject() : populatedChat;

        // Emit real-time socket events immediately
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("send-message", {
                receiverId,
                chat,
            });
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("meg-sent", {
                sender: id,
                chat,
            });

            if (isReceiverOnline) {
                io.to(senderSocketId).emit("message:status-update", {
                    messageId: chat._id,
                    status: "delivered",
                    deliveredAt,
                });
            }
        }

        // Await user updates to ensure consistency
        await updateUsersPromise;

        return chat;
    };

    markMessagesAsRead = async (userId, senderId) => {
        const now = new Date();

        const [updated] = await Promise.all([
            Messages.updateMany(
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
            ),
            Users.findByIdAndUpdate(userId, { "lastMessage.isRead": true }),
            Users.findByIdAndUpdate(senderId, { "lastMessage.isRead": true }),
        ]);

        const senderSocketId = getSocketId(senderId);
        const readerSocketId = getSocketId(userId);

        const readPayload = {
            readerId: userId,
            senderId,
            readAt: now,
        };

        if (senderSocketId) {
            io.to(senderSocketId).emit("messages:read", readPayload);
        }
        if (readerSocketId && readerSocketId !== senderSocketId) {
            io.to(readerSocketId).emit("messages:read", readPayload);
        }

        return { success: true, count: updated.modifiedCount };
    };

    markMessagesAsDelivered = async (userId) => {
        const now = new Date();
        const pendingMessages = await Messages.find({
            receiver: userId,
            status: "sent",
        })
            .select("_id sender")
            .lean();

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
        // High-performance index-backed fetch
        const messages = await Messages.find({
            $or: [
                { sender: id, receiver: receiverId },
                { sender: receiverId, receiver: id },
            ],
        })
            .sort({ createdAt: 1 })
            .populate("sender", "name profile_pic _id email")
            .populate("receiver", "name profile_pic _id email")
            .populate("reactions.user", "name profile_pic _id")
            .lean();

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

        const updatedChat = await message.populate([
            { path: "sender", select: "name profile_pic _id email" },
            { path: "receiver", select: "name profile_pic _id email" },
        ]);

        const receiverSocketId = getSocketId(message.receiver);
        const senderSocketId = getSocketId(message.sender);

        const payload = {
            receiverId: message.receiver,
            chat: updatedChat,
        };

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message:updated", payload);
        }
        if (senderSocketId && senderSocketId !== receiverSocketId) {
            io.to(senderSocketId).emit("message:updated", payload);
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

        const updatedChat = await message.populate([
            { path: "sender", select: "name profile_pic _id email" },
            { path: "receiver", select: "name profile_pic _id email" },
        ]);

        const receiverSocketId = getSocketId(message.receiver);
        const senderSocketId = getSocketId(message.sender);

        const payload = {
            receiverId: message.receiver,
            chat: updatedChat,
        };

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message:deleted", payload);
        }
        if (senderSocketId && senderSocketId !== receiverSocketId) {
            io.to(senderSocketId).emit("message:deleted", payload);
        }

        return updatedChat;
    };

    reactToMessage = async (userId, messageId, emoji) => {
        const message = await Messages.findById(messageId);
        if (!message) throw new Error("Message not found");
        if (message.deleted) throw new Error("Message is deleted");

        message.reactions = message.reactions.filter(
            (r) => r.user.toString() !== userId
        );

        message.reactions.push({ user: userId, emoji });
        await message.save();

        const updatedChat = await message.populate([
            { path: "sender", select: "name profile_pic _id email" },
            { path: "receiver", select: "name profile_pic _id email" },
            { path: "reactions.user", select: "name profile_pic _id" },
        ]);

        const receiverSocketId = getSocketId(message.receiver);
        const senderSocketId = getSocketId(message.sender);

        const payload = {
            receiverId: message.receiver,
            chat: updatedChat,
        };

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message:reacted", payload);
        }
        if (senderSocketId && senderSocketId !== receiverSocketId) {
            io.to(senderSocketId).emit("message:reacted", payload);
        }

        return updatedChat;
    };

    UpdateReactToMessage = async (userId, messageId, emoji) => {
        return this.reactToMessage(userId, messageId, emoji);
    };

    deleteReactToMessage = async (userId, messageId, emoji) => {
        const message = await Messages.findById(messageId);
        if (!message) throw new Error("Message not found");
        if (message.deleted) throw new Error("Message is deleted");

        message.reactions = message.reactions.filter(
            (r) => !(r.user.toString() === userId && (!emoji || r.emoji === emoji))
        );

        await message.save();

        const updatedChat = await message.populate([
            { path: "sender", select: "name profile_pic _id email" },
            { path: "receiver", select: "name profile_pic _id email" },
            { path: "reactions.user", select: "name profile_pic _id" },
        ]);

        const receiverSocketId = getSocketId(message.receiver);
        const senderSocketId = getSocketId(message.sender);

        const payload = {
            receiverId: message.receiver,
            chat: updatedChat,
        };

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message:deletedReact", payload);
        }
        if (senderSocketId && senderSocketId !== receiverSocketId) {
            io.to(senderSocketId).emit("message:deletedReact", payload);
        }

        return updatedChat;
    };
}

export default new MessageService();


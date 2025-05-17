import { Users } from "../model/user.model.js";
import { Messages } from "../model/message.model.js";
import { getSocketId, io } from "../socket/socket.js";

class MessageService {
    sendMessage = async (id, body) => {
        const sender = await Users.findById(id);
        const receiver = await Users.findById(body.receiver);

        if (!sender || !receiver) {
            throw new Error("User not found");
        }

        const messageData = {
            sender: id,
            receiver: body.receiver,
            receiverModel: body.receiverModel,
            message: body.message || "",
        };

        if (body.image) {
            messageData.image = body.image;
            messageData.imageId = body.imageId; // optional: useful if you want to delete it later
        }

        const newMessage = await Messages.create(messageData);

        const chat = await Messages.findById(newMessage._id)
            .populate("sender", "name profile_pic _id email")
            .populate("receiver", "name profile_pic _id email");

        const receiverSocketId = getSocketId(body.receiver);
        const senderSocketId = getSocketId(id);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("send-message", {
                receiverId: body.receiver,
                chat,
            });
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("meg-sent", { sender: id, chat });
        }

        return chat;
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
        await message.save();

        io.to(getSocketId(message.receiver)).emit("message:updated", {
            type: "edit",
            messageId,
            message: text,
        });

        return message;
    };

    deleteMessage = async (userId, messageId) => {
        const message = await Messages.findById(messageId);
        if (!message || message.sender.toString() !== userId) {
            throw new Error("You are not authorized to delete this message");
        }

        message.deleted = true;
        message.message = "This message was deleted";
        await message.save();

        io.to(getSocketId(message.receiver)).emit("message:deleted", {
            type: "delete",
            messageId,
        });

        return message;
    };

    reactToMessage = async (userId, messageId, emoji) => {
        const message = await Messages.findById(messageId);
        if (!message) throw new Error("Message not found");
        if (message.deleted) throw new Error("message not found");

        const existing = message.reactions.filter(
            (r) => r.user.toString() !== userId && r.emoji === emoji
        );
        console.log(existing, "existing emoji");

        if (!existing) {
            message.reactions.push({ user: userId, emoji });
        }

        await message.save();

        io.to(getSocketId(message.receiver)).emit("message:reacted", {
            type: "reaction",
            messageId,
            emoji,
            userId,
        });
        return message;
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
        await message.populate("reactions.user", "name profile_pic _id");

        io.to(getSocketId(message.receiver)).emit("message:reacted", {
            type: "reaction-delete",
            messageId,
            emoji,
            userId,
        });

        return message;
    };
}

export default new MessageService();

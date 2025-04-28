import mongoose from "mongoose";
import { Messages } from "../model/message.model.js";
import { Status } from "../model/status.model.js";

import { Users } from "../model/user.model.js";
import { getSocketId, io } from "../socket/socket.js";

class StatusService {
    createStatus = async (userId, body) => {
        const user = await Users.findById(userId);
        if (!user) throw new Error("User not found");

        const {
            type,
            url,
            public_id,
            text = "",
            background,
            poll,
            isPublic = true,
            allowedUsers = [],
        } = body;

        if (
            type === "poll" &&
            (!poll?.question || !Array.isArray(poll.options))
        ) {
            throw new Error("Poll must include a question and options.");
        }

        const media =
            type !== "text" && type !== "poll" ? { url, public_id } : undefined;

        const status = await Status.create({
            user: userId,
            type,
            media,
            text,
            background,
            poll,
            isPublic,
            allowedUsers: isPublic ? [] : allowedUsers,
        });

        //  Emit socket event to friends or allowed users
        const targetUsers = isPublic ? user.friends : allowedUsers;
        targetUsers.forEach((friendId) => {
            const socketId = getSocketId(friendId.toString());
            if (socketId) {
                io.to(socketId).emit("newStatus", status);
            }
        });

        return status;

        // const chat = await Messages.findById(data._id)
        //     .populate("senderId", "name profile_pic _id email")
        //     .populate("receiverId", "name profile_pic _id email");

        // const reciverSocketId = getSocketId(body.reciverId);
        // console.log("reciver id", reciverSocketId);
        // const senderSocketId = getSocketId(id);

        // io.to(reciverSocketId).emit("send-message", {
        //     reciverId: body.reciverId,
        //     chat,
        // });
        // io.to(senderSocketId).emit("meg-sent", { sender: id, chat });
        // return chat;
    };
    getStatuses = async (viewerId) => {
        const viewerObjectId = new mongoose.Types.ObjectId(viewerId);

        const statuses = await Status.find({
            expiry: { $gt: new Date() }, // not expired
            $or: [
                { isPublic: true },
                { allowedUsers: viewerObjectId }, // explicitly allowed
                { user: viewerObjectId }, // own statuses
            ],
        })
            .populate("user", "name profile_pic")
            .sort({ createdAt: -1 });

        return statuses;
    };

    likeStatus = async (userId, statusId) => {
        const status = await Status.findById(statusId);
        if (!status) throw new Error("Status not found");

        const alreadyLiked = status.likes.some(
            (like) => like.user.toString() === userId
        );
        if (!alreadyLiked) {
            status.likes.push({ user: userId });
            await status.save();

            //  Emit real-time like notification to the status owner
            const socketId = getSocketId(status.user.toString());
            if (socketId) {
                io.to(socketId).emit("status:interacted", {
                    type: "like",
                    statusId,
                    userId,
                });
            }
        }

        return status;
    };

    viewStatus = async (userId, statusId) => {
        const status = await Status.findById(statusId);
        if (!status) throw new Error("Status not found");

        const alreadyViewed = status.views.some(
            (view) => view.user.toString() === userId
        );
        if (!alreadyViewed) {
            status.views.push({ user: userId });
            await status.save();

            //  Emit real-time view notification to the status owner
            const socketId = getSocketId(status.user.toString());
            if (socketId) {
                io.to(socketId).emit("status:interacted", {
                    type: "view",
                    statusId,
                    userId,
                });
            }
        }

        return status;
    };

    deleteStatus = async (userId, statusId) => {
        const status = await Status.findById(statusId);
        if (!status) {
            throw new Error("Status not found");
        }

        if (status.user.toString() !== userId) {
            throw new Error("You are not authorized to delete this status");
        }

        const delet = await Status.findByIdAndDelete(statusId); // or Status.findByIdAndDelete(statusId);

        return status;
    };
}

export default new StatusService();

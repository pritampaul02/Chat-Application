import { sendEmail } from "../utils/sendMail.js";
import { genarate6DigitOtp } from "../utils/OtpGenarate.js";
import { fileDestroy, fileUploader } from "../utils/fileUpload.js";
import { timeExpire } from "../utils/timeExpire.js";
import { Users } from "../model/user.model.js";
import { Messages } from "../model/message.model.js";
import {
    manageFriendRequest,
    sendFriendRequest,
} from "../controller/user.controller.js";
import mongoose from "mongoose";
import { getSocketId, io } from "../socket/socket.js";
import { Socket } from "socket.io";
import { any } from "zod";

export const UserService = {
    async createUser(userData) {
        const { email } = userData;

        const existUser = await Users.findOne({ email });
        if (existUser) {
            throw new Error(
                "User already exist! please try again with another email"
            );
        }

        const user = await Users.create(userData);
        const otp = genarate6DigitOtp();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
        await user.save();

        await sendEmail(
            user.email,
            `Welcome ${user.name}`,
            "Thank you for choosing Vraman Sathi Pvt. Ltd. for your transportation needs."
        );
        await sendEmail(user.email, "Verify Account - OTP", otp);

        return user;
    },

    async sendOtpForVerification(email) {
        const user = await Users.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const otp = genarate6DigitOtp();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
        await user.save();
        await sendEmail(email, "Verify Account - OTP", otp);
    },

    async verifyOtp(otp) {
        const user = await Users.findOne({
            otp,
            otpExpiry: { $gt: Date.now() },
        });
        if (!user) {
            throw new Error("Invalid OTP");
        }

        user.otp = null;
        user.otpExpiry = null;
        user.isVerified = true;
        // console.log(user);
        await user.save();

        return user;
    },

    async getUserById(id) {
        const user = await Users.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) },
            },

            {
                $lookup: {
                    from: "users",
                    localField: "friends",
                    foreignField: "_id",
                    as: "friends",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "friendRequests",
                    foreignField: "_id",
                    as: "friendRequests",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sendFriendRequst",
                    foreignField: "_id",
                    as: "sentFriendRequests",
                },
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    profile_pic: 1,
                    coverPhoto: 1,
                    location: 1,
                    bio: 1,
                    status: 1,
                    last_online: 1,
                    lastSeen: 1,
                    isOnline: 1,
                    totalFriends: { $size: "$friends" },
                    totalFriendRequests: { $size: "$friendRequests" },

                    friends: {
                        $map: {
                            input: "$friends",
                            as: "f",
                            in: {
                                _id: "$$f._id",
                                name: "$$f.name",
                                email: "$$f.email",
                                profile_pic: "$$f.profile_pic",
                                status: "$$f.status",
                                last_online: "$$f.last_online",
                                lastSeen: "$$f.lastSeen",
                                isOnline: "$$f.isOnline",
                            },
                        },
                    },
                    friendRequests: {
                        $map: {
                            input: "$friendRequests",
                            as: "fr",
                            in: {
                                _id: "$$fr._id",
                                name: "$$fr.name",
                                email: "$$fr.email",
                                profile_pic: "$$fr.profile_pic",
                            },
                        },
                    },
                    sentFriendRequests: {
                        $map: {
                            input: "$sentFriendRequests",
                            as: "f",
                            in: {
                                _id: "$$f._id",
                                name: "$$f.name",
                                email: "$$f.email",
                                profile_pic: "$$f.profile_pic",
                            },
                        },
                    },
                },
            },
        ]);

        if (!user.length) throw new Error("User not found");

        const currentUser = user[0];
        const friendList = currentUser.friends || [];

        if (friendList.length > 0) {
            const friendObjectIds = friendList.map(
                (f) => new mongoose.Types.ObjectId(f._id)
            );
            const userObjectId = new mongoose.Types.ObjectId(id);

            // 1. Calculate unread counts per friend (messages sent to current user that are not yet read)
            const unreadAgg = await Messages.aggregate([
                {
                    $match: {
                        receiver: userObjectId,
                        sender: { $in: friendObjectIds },
                        isRead: false,
                    },
                },
                {
                    $group: {
                        _id: "$sender",
                        count: { $sum: 1 },
                    },
                },
            ]);

            const unreadMap = {};
            unreadAgg.forEach((item) => {
                unreadMap[item._id.toString()] = item.count;
            });

            // 2. Fetch the latest message for each pairwise conversation
            const lastMsgAgg = await Messages.aggregate([
                {
                    $match: {
                        $or: [
                            { sender: userObjectId, receiver: { $in: friendObjectIds } },
                            { receiver: userObjectId, sender: { $in: friendObjectIds } },
                        ],
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $project: {
                        sender: 1,
                        receiver: 1,
                        message: 1,
                        type: 1,
                        media: 1,
                        image: 1,
                        status: 1,
                        isRead: 1,
                        createdAt: 1,
                        editedAt: 1,
                        otherUser: {
                            $cond: {
                                if: { $eq: ["$sender", userObjectId] },
                                then: "$receiver",
                                else: "$sender",
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: "$otherUser",
                        lastMsg: { $first: "$$ROOT" },
                    },
                },
            ]);

            const lastMsgMap = {};
            lastMsgAgg.forEach((item) => {
                lastMsgMap[item._id.toString()] = item.lastMsg;
            });

            // 3. Attach conversation lastMessage, unread count, and notification badges
            currentUser.friends = friendList.map((f) => {
                const friendIdStr = f._id.toString();
                const lastMsg = lastMsgMap[friendIdStr];
                const unreadCount = unreadMap[friendIdStr] || 0;

                let lastMessageObj = null;
                if (lastMsg) {
                    const isSender = String(lastMsg.sender) === String(id);
                    lastMessageObj = {
                        _id: lastMsg._id,
                        sender: lastMsg.sender,
                        receiver: lastMsg.receiver,
                        type: isSender ? "sender" : "receiver",
                        isRead: lastMsg.isRead,
                        status: lastMsg.status || "sent",
                        createdAt: lastMsg.createdAt,
                        editedAt: lastMsg.editedAt,
                        message:
                            lastMsg.message ||
                            (lastMsg.type === "image" || lastMsg.image || lastMsg.media
                                ? "📷 Media"
                                : ""),
                    };
                }

                return {
                    ...f,
                    last_online: f.last_online || f.lastSeen || null,
                    lastSeen: f.lastSeen || f.last_online || null,
                    unreadCount,
                    msgNotification: unreadCount,
                    lastMessage: lastMessageObj,
                };
            });

            // 4. Sort friends so that the most recent conversation always appears at the top
            currentUser.friends.sort((a, b) => {
                const timeA = a.lastMessage?.createdAt
                    ? new Date(a.lastMessage.createdAt).getTime()
                    : 0;
                const timeB = b.lastMessage?.createdAt
                    ? new Date(b.lastMessage.createdAt).getTime()
                    : 0;
                return timeB - timeA;
            });
        }

        return currentUser;
    },

    async getAllUser(userId) {
        return await Users.find({ _id: { $ne: userId } });
    },

    async searchUsers({ query = "", skip = 0, limit = 10 }) {
        const regex = new RegExp(query, "i");

        const users = await Users.find({ name: regex })
            .skip(Number(skip))
            .limit(Number(limit))
            .select("name _id bio profile_pic");

        const total = await Users.countDocuments({ name: regex });

        return {
            users,
            hasMore: skip + limit < total,
        };
    },

    async getAllUsersWithPosts() {
        return await Users.aggregate([
            {
                $lookup: {
                    from: "blogs",
                    localField: "_id",
                    foreignField: "user",
                    as: "posts",
                },
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    role: 1,
                    posts: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    isVerify: 1,
                    totalPosts: { $size: "$posts" },
                },
            },
        ]);
    },

    async changeProfilePic(userId, file) {
        const user = await Users.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        if (user.profile_pic?.public_id) {
            await fileDestroy(user.profile_pic.public_id);
        }

        const { url, public_id, error } = await fileUploader(file);
        if (error) {
            throw new Error("File upload failed");
        }

        user.profile_pic = { url, public_id };
        await user.save();
        return user;
    },
    async changeCoverPhoto(userId, file) {
        const user = await Users.findById(userId);
        if (!user) throw new Error("User not found");

        if (user.coverPhoto?.public_id) {
            await fileDestroy(user.coverPhoto.public_id);
        }

        const { url, public_id, error } = await fileUploader(file);
        if (error) throw new Error("File upload failed");

        user.coverPhoto = { url, public_id };
        await user.save();
        return user;
    },
    async changeBio(userId, newBio) {
        const user = await Users.findById(userId);
        if (!user) throw new Error("User not found");

        user.bio = newBio;
        await user.save();
        return user;
    },

    async updateUserLocation(userId, place) {
        const user = await Users.findById(userId);
        if (!user) throw new Error("User not found");

        user.location = { place };
        await user.save();
        return user;
    },

    async loginUser(email, password) {
        const user = await Users.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            throw new Error("Invalid email or password");
        }

        if (user.isTwoStepAuth) {
            const otp = genarate6DigitOtp();
            user.otp = otp;
            user.otpExpiry = Date.now() + 5 * 60 * 1000;
            await user.save();
            await sendEmail(user.email, "Two Step Verification", otp);
            return { requiresTwoStep: true };
        }

        return user;
    },

    async updateUserRole(userId, newRole) {
        const user = await Users.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (user.role === newRole) {
            throw new Error(`User is already a ${newRole}`);
        }
        user.role = newRole;
        await user.save();
        return user;
    },

    async deleteUser(id) {
        return await Users.findByIdAndDelete(id);
    },

    async addTwoStepVerification(userId, isTwoStepAuth) {
        const user = await Users.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.isVerify) {
            throw new Error("First Verify Your Account");
        }
        user.isTwoStepAuth = isTwoStepAuth;
        await user.save();
        return user;
    },

    async updateUser(id, updateData) {
        return await Users.findByIdAndUpdate(id, updateData, {
            new: true,
            timestamps: true,
        });
    },

    async forgotPassword(email) {
        const user = await Users.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const otp = genarate6DigitOtp();
        await sendEmail(
            email,
            "OTP for Password Reset",
            `Your OTP is ${otp}. Do not share it with anyone.`
        );
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save({ validateBeforeSave: false });
        return user;
    },

    async resetPasswordWithOtp(otp, email, newPassword) {
        const user = await Users.findOne({ otp, email }).select("+password");
        if (!user || timeExpire(user.expireAt)) {
            throw new Error("Invalid or expired OTP");
        }
        user.password = newPassword;
        user.otp = null;
        await user.save({ validateBeforeSave: false });
        console.log(user, "user", user.password, "new password", newPassword);
        return user;
    },

    async changePasswordWithOldPassword(userId, oldPassword, newPassword) {
        const user = await Users.findById(userId).select("+password");
        if (!user || !(await user.comparePassword(oldPassword))) {
            throw new Error("Incorrect old password");
        }
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });
        return user;
    },

    async sendFriendRequest(userId, body) {
        // console.log("sendFriendRequest", body);
        const sender = await Users.findById(userId);
        // console.log(sender, "sender");
        if (!sender) {
            throw new Error("User Not Found (Sender)");
        }

        const receiverId = body.requestId;

        const receiver = await Users.findById(receiverId);
        if (!receiver) {
            throw new Error("User Not Found (Receiver)");
        }

        //  Check if already friends
        if (
            sender.friends.includes(receiverId) ||
            receiver.friends.includes(userId)
        ) {
            throw new Error("User is already in your friend list!");
        }

        // Check if friend request already sent
        if (
            sender.sentFriendRequests.includes(receiverId) ||
            receiver.friendRequests.includes(userId)
        ) {
            throw new Error("Friend request already sent!");
        }

        if (
            receiver.sentFriendRequests.includes(userId) ||
            sender.friendRequests.includes(receiverId)
        ) {
            throw new Error("This user already sent you a friend request!");
        }

        //  Add to pending requests
        sender.sentFriendRequests.push(receiverId);
        receiver.friendRequests.push(userId);

        await sender.save();
        await receiver.save();
        // console.log(sender.name, "sender.name ");
        const reciverSocketId = await getSocketId(receiverId);
        // console.log("reciver socket id ", reciverSocketId);

        io.to(reciverSocketId).emit("friendRequest", {
            senderId: userId,
            senderName: sender.name,
        });

        const senderSocketId = await getSocketId(userId);
        // console.log("sender socket id ", senderSocketId);

        io.to(senderSocketId).emit("sendFriendRequest", {
            senderId: receiverId,
            senderName: receiver.name,
        });

        const data = await this.getUserById(userId);
        return data;
    },

    async cancelFriendRequest(userId, body) {
        const sender = await Users.findById(userId);
        if (!sender) {
            throw new Error("User Not Found (Sender)");
        }
        const receiverId = body.requestId;
        const receiver = await Users.findById(receiverId);
        if (!receiver) {
            throw new Error("User Not Found (Receiver)");
        }

        sender.sentFriendRequests = sender.sentFriendRequests.filter(
            (item) => String(item) !== String(receiverId)
        );
        sender.friendRequests = sender.friendRequests.filter(
            (item) => String(item) !== String(receiverId)
        );

        receiver.friendRequests = receiver.friendRequests.filter(
            (item) => String(item) !== String(userId)
        );
        receiver.sentFriendRequests = receiver.sentFriendRequests.filter(
            (item) => String(item) !== String(userId)
        );

        await sender.save();
        await receiver.save();

        const reciverSocketId = await getSocketId(receiverId);
        if (reciverSocketId) {
            io.to(reciverSocketId).emit("cancelFriendRequest", {
                senderId: userId,
                senderName: sender.name,
            });
        }

        const senderSocketId = await getSocketId(userId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("cancelFriendRequest", {
                senderId: receiverId,
                senderName: receiver.name,
            });
        }

        return await this.getUserById(userId);
    },

    async manageFriendRequest(userId, body) {
        const sender = await Users.findById(userId);
        if (!sender) {
            throw new Error("User Not Found (Sender)");
        }
        const receiverId = body["requestId"];
        const receiver = await Users.findById(receiverId);
        if (!receiver) {
            throw new Error("User Not Found (Receiver)");
        }

        if (body["action"] === "unfriend") {
            sender.friends = sender.friends.filter(
                (item) => String(item) !== String(receiverId)
            );
            receiver.friends = receiver.friends.filter(
                (item) => String(item) !== String(userId)
            );

            await sender.save();
            await receiver.save();

            const reciverSocketId = await getSocketId(receiverId);
            if (reciverSocketId) {
                io.to(reciverSocketId).emit("unfriend", {
                    senderId: userId,
                    senderName: sender.name,
                });
            }

            const senderSocketId = await getSocketId(userId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("unfriend", {
                    senderId: receiverId,
                    senderName: receiver.name,
                });
            }

            return await this.getUserById(userId);
        }

        if (body["action"] === "accept") {
            // Add to friends only if not already friends
            if (!sender.friends.includes(receiverId)) {
                sender.friends.push(receiverId);
            }
            if (!receiver.friends.includes(userId)) {
                receiver.friends.push(userId);
            }
        }

        if (body["action"] === "reject" || body["action"] === "accept") {
            // Remove from pending requests on both sides
            sender.friendRequests = sender.friendRequests.filter(
                (item) => String(item) !== String(receiverId)
            );
            sender.sentFriendRequests = sender.sentFriendRequests.filter(
                (item) => String(item) !== String(receiverId)
            );
            receiver.sentFriendRequests = receiver.sentFriendRequests.filter(
                (item) => String(item) !== String(userId)
            );
            receiver.friendRequests = receiver.friendRequests.filter(
                (item) => String(item) !== String(userId)
            );

            await sender.save();
            await receiver.save();

            const reciverSocketId = await getSocketId(receiverId);
            if (reciverSocketId) {
                io.to(reciverSocketId).emit("manageSendFriendReq", {
                    senderId: userId,
                    senderName: sender.name,
                    action: body["action"],
                });
            }

            const senderSocketId = await getSocketId(userId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("manageFriendReq", {
                    senderId: receiverId,
                    senderName: receiver.name,
                    action: body["action"],
                });
            }

            const data = await this.getUserById(userId);
            return data;
        } else {
            throw new Error("Invalid action");
        }
    },

    async registerDeviceToken(userId, token) {
        if (!userId || !token) return;
        await Users.findByIdAndUpdate(userId, {
            $addToSet: { deviceTokens: token },
        });
        return { success: true };
    },

    async userStatusChanger(userId, status) {
        try {
            const user = await Users.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            const now = new Date();
            if (status === "offline") {
                user.lastSeen = now;
                user.last_online = now;
                user.isOnline = false;
            } else {
                user.isOnline = true;
            }

            user.status = status;
            await user.save();

            // Emit status update using socket.io
            io.emit("user-status-change", {
                userId: user._id,
                user: {
                    _id: user._id,
                    name: user.name,
                    status: user.status,
                    lastSeen: user.lastSeen,
                    last_online: user.last_online,
                    isOnline: user.isOnline,
                },
                status: status,
                lastSeen: user.lastSeen,
                last_online: user.last_online,
                isOnline: user.isOnline,
            });

            return user;
        } catch (error) {
            console.error("Error in userStatusChanger:", error);
        }
    },

    async updateLastLogin(userId) {
        if (!userId || userId === "undefined") return;

        const now = new Date();
        await Users.updateOne(
            { _id: userId },
            {
                last_online: now,
                lastSeen: now,
                isOnline: false,
                status: "offline",
            }
        );

        io.emit("user:last-seen", {
            userId,
            lastSeen: now,
            last_online: now,
            isOnline: false,
            status: "offline",
        });
    },

    async savePushSubscription(userId, subscription) {
        if (!userId || !subscription || !subscription.endpoint) return;
        await Users.findByIdAndUpdate(userId, {
            $addToSet: { pushSubscriptions: subscription },
        });
        return { success: true };
    },
};

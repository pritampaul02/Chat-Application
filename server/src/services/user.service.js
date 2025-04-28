import { sendEmail } from "../utils/sendMail.js";
import { genarate6DigitOtp } from "../utils/OtpGenarate.js";
import { fileDestroy, fileUploader } from "../utils/fileUpload.js";
import { timeExpire } from "../utils/timeExpire.js";
import { Users } from "../model/user.model.js";
import {
    manageFriendRequest,
    sendFriendRequest,
} from "../controller/user.controller.js";
import mongoose from "mongoose";
import { getSocketId, io } from "../socket/socket.js";
import { Socket } from "socket.io";

export const UserService = {
    async createUser(userData) {
        console.log("ok created account ");
        const { email } = userData;
        console.log(email, "for veryfy email exist user");

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
        user.isVerify = true;
        await user.save();
        return user;
    },

    async getUserById(id) {
        const user = await Users.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }, // Match the user by ID
            },

            {
                $lookup: {
                    from: "users", // Collection name should match MongoDB collection (pluralized)
                    localField: "friends",
                    foreignField: "_id",
                    as: "friends",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "friendsRequast", // Ensure the field name matches the schema
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
                    totalFriends: { $size: "$friends" }, // Calculate total number of friends
                    friends: { _id: 1, name: 1, email: 1, profile_pic: 1 },
                    friendRequests: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        profile_pic: 1,
                    },
                    sentFriendRequests: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        profile_pic: 1,
                    },
                },
            },
        ]);

        if (!user) throw new Error("User not found");
        console.log("user ========> ", user);

        return user;
    },

    async getAllUser(userId) {
        return await Users.find({ _id: { $ne: userId } });
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

    async resetPasswordWithOtp(otp, newPassword) {
        const user = await Users.findOne({ otp }).select("+password");
        if (!user || timeExpire(user.expireAt)) {
            throw new Error("Invalid or expired OTP");
        }
        user.password = newPassword;
        user.otp = null;
        await user.save({ validateBeforeSave: false });
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
        const sender = await Users.findById(userId);
        if (!sender) {
            throw new Error("User Not Found (Sender)");
        }

        const receiverId = body["requastId"];
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

        const reciverSocketId = await getSocketId(receiverId);
        console.log("reciver socket id ", reciverSocketId);

        io.to(reciverSocketId).emit("friendRequest", {
            senderId: userId,
            senderName: sender.name,
        });

        const senderSocketId = await getSocketId(userId);
        console.log("sender socket id ", senderSocketId);

        io.to(senderSocketId).emit("sendFriendRequest", {
            senderId: receiverId,
            senderName: receiver.name,
        });

        const data = await this.getUserById(userId);
        return data;
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
            //  Remove from pending requests

            sender.friendRequests = sender.friendRequests.filter(
                (item) => String(item) !== receiverId
            );
            receiver.sentFriendRequests = receiver.sentFriendRequests.filter(
                (item) => String(item) !== userId
            );

            //  console.log(sender.sendFriendRequst);
            //  console.log(receiver.friendsRequast);

            const reciverSocketId = await getSocketId(receiverId);
            console.log("reciver socket id ", reciverSocketId);

            io.to(reciverSocketId).emit("manageSendFriendReq", {
                senderId: userId,
                senderName: sender.name,
            });

            const senderSocketId = await getSocketId(userId);
            console.log("sender socket id ", senderSocketId);

            io.to(senderSocketId).emit("manageFriendReq", {
                senderId: receiverId,
                senderName: receiver.name,
            });

            await sender.save();
            await receiver.save();
            const data = await this.getUserById(userId);
            return data;
        } else {
            throw new Error("Invalid action");
        }
    },

    async userStatusChanger(userId, status) {
        try {
            const user = await Users.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            if (status === "offline") {
                user.lastSeen = Date.now();
            } else {
                user.lastSeen = null;
            }

            user.status = status;
            await user.save();

            // Emit message using socket.io
            const message =
                status === "online"
                    ? `${user.name} is now online`
                    : `${user.name} went offlin`;

            Socket.emit("user-status-change", {
                uuser: user,
                status: status,
                message: message,
                lastSeen: user.lastSeen,
            });

            return user;
        } catch (error) {
            console.error("somthing went wrong", error);
        }
    },
};

import { UserService } from "../services/user.service.js";
import { sendCookie } from "../utils/sendCookie.js";

import { sendResponse } from "../utils/response.handler.js";
import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import { RESPONSE_MESSAGES } from "../constants/responseMessage.constants.js";
import { uploadToCloudinary } from "../middlewares/multer.middleware.js";
import { Users } from "../model/user.model.js";
import { cloudinaryFileUploader, fileDestroy } from "../utils/fileUpload.js";

export const createUser = async (req, res) => {
    try {
        const user = await UserService.createUser(req.body);
        // console.log("user", user);
        sendCookie(user, res, "User created successfully", HTTP_STATUS.OK);
    } catch (error) {
        console.error(error, "=====> error");
        sendResponse(res, {
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message || "Internal server error",
            error,
        });
    }
};
// check for user is already login or not before login
export const getMe = async (req, res) => {
    try {
        res.json(req.user); // Return the user data
    } catch (error) {
        res.status(500).json({ message: "Server error hello" });
    }
};

export const sendOtpForVerifyAccount = async (req, res) => {
    try {
        await UserService.sendOtpForVerification(req.body.email);
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "OTP sent successfully.",
        });
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.BAD_REQUEST,
            success: false,
            message: error.message,
        });
    }
};

export const VerifyOtpWithExpiry = async (req, res) => {
    try {
        const user = await UserService.verifyOtp(req.body.otp);
        sendCookie(user, res, "OTP verified successfully!", HTTP_STATUS.OK);
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.BAD_REQUEST,
            success: false,
            message: error.message,
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.user;
        console.log(id);
        const user = await UserService.getUserById(id);
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "User fetched successfully.",
            data: user,
        });
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message,
            error,
        });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { query = "", skip = 0, limit = 10 } = req.query;

        const result = await UserService.searchUsers({
            query,
            skip: Number(skip),
            limit: Number(limit),
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to search users" });
    }
};

export const getAllUsersWithPost = async (req, res) => {
    try {
        const usersWithPosts = await UserService.getAllUsersWithPosts();
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "All users fetched",
            data: usersWithPosts,
        });
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            message: RESPONSE_MESSAGES.INTERNAL_ERROR,
            error,
        });
    }
};

//get user by id

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        // console.log(userId);
        const user = await UserService.getUserById(userId);

        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "User fetched successfully.",
            data: user,
        });
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message,
            error,
        });
    }
};

export const logInUser = async (req, res) => {
    try {
        console.log("hello login");
        const { email, password } = req.body;
        console.log(email, password, "hello");
        const result = await UserService.loginUser(email, password);
        if (result.requiresTwoStep) {
            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "Verification code sent to your email",
            });
        }
        sendCookie(result, res, "User login successful", HTTP_STATUS.OK);
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.BAD_REQUEST,
            success: false,
            message: error.message,
        });
    }
};

export const logOutUser = (req, res) => {
    try {
        res.status(HTTP_STATUS.OK).cookie("token", "", {
            expires: new Date(),
            httpOnly: true,
        });
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            message: RESPONSE_MESSAGES.INTERNAL_ERROR,
            error,
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await UserService.deleteUser(id);
        res.cookie("token", "", { expires: new Date(), httpOnly: true });
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "User deleted successfully.",
        });
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to delete user.",
            error,
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserService.updateUser(id, req.body);
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "User updated successfully.",
            data: user,
        });
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to update user.",
            error,
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await UserService.forgotPassword(email);
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "OTP sent successfully.",
        });
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.BAD_REQUEST,
            success: false,
            message: error.message,
        });
    }
};

export const changePassWithOtp = async (req, res) => {
    try {
        const { otp, email, password } = req.body;
        await UserService.resetPasswordWithOtp(otp, email, password);
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "Password reset successful.",
        });
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.BAD_REQUEST,
            success: false,
            message: error.message,
        });
    }
};

export const ChangePasswordWithOldPassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { oldPassword, newPassword } = req.body;
        const user = await UserService.changePasswordWithOldPassword(
            id,
            oldPassword,
            newPassword
        );
        sendCookie(user, res, "Password changed successfully", HTTP_STATUS.OK);
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.BAD_REQUEST,
            success: false,
            message: error.message,
        });
    }
};

export const getAllUser = async (req, res) => {
    try {
        const { id } = req.user;
        const users = await UserService.getAllUser(id);
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: RESPONSE_MESSAGES.GET_ALL_USER_SUCSESS,
            data: users,
        });
    } catch (error) {
        sendResponse(res, {
            status: HTTP_STATUS.BAD_REQUEST,
            success: false,
            message: RESPONSE_MESSAGES.GET_ALL_USER_FAILD,
            error: error,
        });
    }
};

// friend req manager

export const sendFriendRequest = async (req, res) => {
    try {
        // console.log("this is friend request API", req.body);

        const { id } = req.user;

        const data = await UserService.sendFriendRequest(id, req.body);
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            data: data,
            success: true,
            message: RESPONSE_MESSAGES.SEND_FRIND_REQUST_SUCCESS,
        });
    } catch (error) {
        console.error("error in send friend req==>", error);

        sendResponse(res, {
            status: HTTP_STATUS.BAD_REQUEST,
            success: false,
            message: error.message || RESPONSE_MESSAGES.SEND_FRIND_REQUST_FAILD,
        });
    }
};

export const cancelFriendRequest = async (req, res) => {
    try {
        // console.log("Cancel Friend Request API hit");

        const { id } = req.user;

        const data = await UserService.cancelFriendRequest(id, req.body);

        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            data,
            message: RESPONSE_MESSAGES.CANCEL_FRIEND_REQUEST_SUCCESS,
        });
    } catch (error) {
        console.error("Cancel friend request error:", error);

        sendResponse(res, {
            status: HTTP_STATUS.BAD_REQUEST,
            success: false,
            message:
                error.message || RESPONSE_MESSAGES.CANCEL_FRIEND_REQUEST_FAILED,
        });
    }
};

export const manageFriendRequest = async (req, res) => {
    try {
        const { id } = req.user;

        const data = await UserService.manageFriendRequest(id, req.body);
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            data: data,
            message: `friend request ${req.body.action}`,
        });
    } catch (error) {
        console.error("error in send friend req==>", error);

        sendResponse(res, {
            status: HTTP_STATUS.BAD_REQUEST,
            success: false,
            message: error.message || RESPONSE_MESSAGES.INTERNAL_ERROR,
        });
    }
};

// change user profile pic bio etc

export const changeProfilePic = async (req, res) => {
    try {
        const user = await UserService.changeProfilePic(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            user,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const changeCoverPhoto = async (req, res) => {
    try {
        const user = await UserService.changeCoverPhoto(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: "Cover photo updated successfully",
            user,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const changeBio = async (req, res) => {
    try {
        const { bio } = req.body;
        const user = await UserService.changeBio(req.user.id, bio);
        res.status(200).json({
            success: true,
            message: "Bio updated successfully",
            user,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateLocation = async (req, res) => {
    try {
        const { place } = req.body;
        const userId = req.user._id;

        if (!place) {
            return res.status(400).json({ message: "Location is required" });
        }

        const updatedUser = await UserService.updateUserLocation(userId, place);
        return res.status(200).json({
            message: "Location updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// // change user profile pic bio etc in one api
// export const updateMyProfile = async (req, res) => {
//     try {
//         console.log(req.file);
//         const { bio, location } = req.body;
//         const { profile_pic, coverPhoto } = req.file;
//         const updatedUser = await UserService.updateMyProfile(
//             req.user.id,
//             {
//                 bio,
//                 location,
//             },
//             { profile_pic, coverPhoto }
//         );

//         sendResponse(res, {
//             status: HTTP_STATUS.OK,
//             success: true,
//             message: "Profile updated successfully",
//             data: updatedUser,
//         });
//     } catch (error) {
//         sendResponse(res, {
//             status: HTTP_STATUS.BAD_REQUEST,
//             success: false,
//             message: error.message,
//         });
//     }
// };
export const updateMyProfile = async (req, res) => {
    try {
        // console.log("BODY:", req.body); // location, bio
        // console.log("FILES:", req.files); // profile_pic, coverPhoto
        const user = await Users.findOne(req.user._id);
        if (!user) {
            throw new Error("user not found");
        }
        const { bio, location } = req.body;

        const updateData = {
            bio,
            location,
        };
        if (user.profile_pic?.public_id) {
            await fileDestroy(user.profile_pic.public_id);
        }

        if (user.coverPhoto?.public_id) {
            await fileDestroy(user.coverPhoto.public_id);
        }

        if (req.files?.profile_pic) {
            const { buffer, mimetype } = req.files.profile_pic[0];

            const result = await cloudinaryFileUploader(
                buffer,
                mimetype,
                "chat-app/profile_pics"
            );

            updateData.profile_pic = {
                url: result.url,
                public_id: result.public_id,
            };
        }

        if (req.files?.coverPhoto) {
            const { buffer, mimetype } = req.files.coverPhoto[0];

            const result = await cloudinaryFileUploader(
                buffer,
                mimetype,
                "chat-app/cover_photos"
            );
            updateData.coverPhoto = {
                url: result.url,
                public_id: result.public_id,
            };
        }

        const updatedUser = await Users.findByIdAndUpdate(
            req.user._id,
            updateData,
            {
                new: true,
            }
        );

        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Profile update failed" });
    }
};

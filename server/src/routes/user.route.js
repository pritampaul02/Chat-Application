import express from "express";
import { validate } from "../middlewares/validate.middleware.js";

import {
    createUser,
    getAllUser,
    getUser,
    logInUser,
    manageFriendRequest,
    sendFriendRequest,
    sendOtpForVerifyAccount,
    VerifyOtpWithExpiry,
    changeProfilePic,
    changeCoverPhoto,
    changeBio,
    updateLocation,
    forgotPassword,
    changePassWithOtp,
    ChangePasswordWithOldPassword,
    updateUser,
    logOutUser,
    getMe,
    searchUsers,
    getUserById,
    cancelFriendRequest,
    updateMyProfile,
} from "../controller/user.controller.js";

import { isAuthenticate } from "../middlewares/authentication.middleware.js";
import userValidation from "../validations/user.validation.js";
import upload from "../middlewares/multer.middleware.js";
// import upload from "../middlewares/multer.upload.js";

const router = express.Router();

router
    .get("/me", isAuthenticate, getMe)
    .post("/register", validate(userValidation.createUser), createUser)
    .post("/login", validate(userValidation.login), logInUser)
    .get("/logout", isAuthenticate ,  logOutUser)
    .post(
        "/send-otp",
        validate(userValidation.sendOtp),
        sendOtpForVerifyAccount
    )
    .post(
        "/verify-otp",
        validate(userValidation.verifyOtp),
        VerifyOtpWithExpiry
    )

    .get("/all-users", isAuthenticate, getAllUser)
    .get("/", isAuthenticate, getUser)
    .get(
        "/search-user",
        isAuthenticate,
        // validate(userValidation.searchUser),
        searchUsers
    )
    // get user by id

    .get(
        "/:userId",
        isAuthenticate,
        validate(userValidation.getUserById),
        getUserById
    )

    .post(
        "/send-friend-requast",
        isAuthenticate,
        validate(userValidation.sendFriendRequest),
        sendFriendRequest
    )
    .post(
        "/cancel-friend-request",
        isAuthenticate,
        validate(userValidation.cancelFriendRequest),
        cancelFriendRequest
    )

    .post(
        "/manage-friend-requast",
        isAuthenticate,
        validate(userValidation.manageFriendRequest),
        manageFriendRequest
    )

    .patch(
        "/change-profile-pic",
        isAuthenticate,
        validate(userValidation.changeProfilePic),
        changeProfilePic
    )
    .patch(
        "/change-cover-photo",
        isAuthenticate,
        validate(userValidation.changeCover),
        changeCoverPhoto
    )

    // Update bio
    .patch(
        "/change-bio",
        isAuthenticate,
        validate(userValidation.changeBio),
        changeBio
    )

    // Update Location

    .patch(
        "/update-location",
        isAuthenticate,
        validate(userValidation.changeLocation),
        updateLocation
    )

    // update bio, update location, update profile photo , update cover photo, in one api

    .patch(
        "/update-all-my-profile",
        isAuthenticate,
        upload.fields([
            { name: "profile_pic", maxCount: 1 },
            { name: "coverPhoto", maxCount: 1 },
        ]),
        validate(userValidation.updateMyProfile), // You’ll define this
        updateMyProfile
    )

    // .patch(
    //     "/update-role/:userId",
    //     validate(userValidation.updateUserRole),
    //     updateUserRoleByAdmin
    // )
    // .patch(
    //     "/two-step-auth",
    //     validate(userValidation.addTwoStepVerification),
    //     addTwoStepVerification
    // )
    .patch("/update/:id", validate(userValidation.updateUser), updateUser)
    .post(
        "/forgot-password",
        validate(userValidation.forgotPassword),
        forgotPassword
    )
    .post(
        "/reset-password",
        validate(userValidation.changePasswordWithOtp),
        changePassWithOtp
    )
    .post(
        "/change-password",
        validate(userValidation.changePasswordWithOldPassword),
        ChangePasswordWithOldPassword
    );

export const userRouter = router;

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
} from "../controller/user.controller.js";

import { isAuthenticate } from "../middlewares/authentication.middleware.js";
import userValidation from "../validations/user.validation.js";

const router = express.Router();

router
    .get("/me", isAuthenticate, getMe)
    .post("/register", validate(userValidation.createUser), createUser)
    .post("/login", validate(userValidation.login), logInUser)
    .get("/logout", logOutUser)
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

    .post(
        "/send-friend-requast",
        isAuthenticate,
        validate(userValidation.sendFriendRequest),
        sendFriendRequest
    )
    .post(
        "/manage-friend-requast",
        isAuthenticate,
        validate(userValidation.manageFriendRequest),
        manageFriendRequest
    )

    .patch(
        "/change-profile-pic",
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

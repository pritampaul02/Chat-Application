import express from "express"
import { validate } from "../middlewares/validate.middleware.js"

import { createUser, getAllUser, getUser, logInUser, manageFriendRequest, sendFriendRequest, sendOtpForVerifyAccount, VerifyOtpWithExpiry } from "../controller/user.controller.js"
import { UserService } from "../services/user.service.js"
import { isAuthenticate } from "../middlewares/authentication.middleware.js"
import userValidation from "../validations/user.validation.js"



const router = express.Router()

router
    .post("/create", validate(userValidation.createUser),  createUser)
    .post("/login", validate(userValidation.login),  logInUser)
    .post("/send-otp", validate(userValidation.sendOtp),  sendOtpForVerifyAccount)
    .post("/verify-otp", validate(userValidation.verifyOtp),  VerifyOtpWithExpiry)
    
    .get("/all-users", isAuthenticate , getAllUser )
    .get("/", isAuthenticate , getUser )
    
    .post("/send-friend-requast" , isAuthenticate , validate(userValidation.sendFriendRequest) , sendFriendRequest )
    .post("/manage-friend-requast" , isAuthenticate , validate(userValidation.manageFriendRequest) , manageFriendRequest )
    
    // .patch("/change-profile-pic", validate(userValidation.changeProfilePic),  changeProfilePic)
    // .patch("/update-role/:userId", validate(userValidation.updateUserRole),  updateUserRoleByAdmin)
    // .patch("/two-step-auth", validate(userValidation.addTwoStepVerification),  addTwoStepVerification)
    // .patch("/update/:id", validate(userValidation.updateUser),  updateUser)
    // .post("/forgot-password", validate(userValidation.forgotPassword),  forgotPassword)
    // .post("/reset-password", validate(userValidation.changePasswordWithOtp),  changePassWithOtp)
    // .post(
    //     "/change-password",
    //     validate(userValidation.changePasswordWithOldPassword),
    //      ChangePasswordWithOldPassword,
    // )

export const userRouter = router


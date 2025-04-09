import express from "express"
import { validate } from "../middlewares/validate.middleware.js"

import { createUser, logInUser, sendOtpForVerifyAccount, VerifyOtpWithExpiry } from "../controller/user.controller.js"
import userValidation from "../validations/user.validation.js"



const router = express.Router()

router
    .post("/create", validate(userValidation.createUser),  createUser)
    .post("/login", validate(userSchemas.login),  logInUser)
    .post("/send-otp", validate(userSchemas.sendOtp),  sendOtpForVerifyAccount)
    .post("/verify-otp", validate(userSchemas.verifyOtp),  VerifyOtpWithExpiry)
    // .patch("/change-profile-pic", validate(userSchemas.changeProfilePic),  changeProfilePic)
    // .patch("/update-role/:userId", validate(userSchemas.updateUserRole),  updateUserRoleByAdmin)
    // .patch("/two-step-auth", validate(userSchemas.addTwoStepVerification),  addTwoStepVerification)
    // .patch("/update/:id", validate(userSchemas.updateUser),  updateUser)
    // .post("/forgot-password", validate(userSchemas.forgotPassword),  forgotPassword)
    // .post("/reset-password", validate(userSchemas.changePasswordWithOtp),  changePassWithOtp)
    // .post(
    //     "/change-password",
    //     validate(userSchemas.changePasswordWithOldPassword),
    //      ChangePasswordWithOldPassword,
    // )

export const userRouter = router


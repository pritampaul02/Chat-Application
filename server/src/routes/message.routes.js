import express from "express"
import { validate } from "../middlewares/validate.middleware.js"
import { isAuthenticate } from "../middlewares/authentication.middleware.js"
import messageValidation from "../validations/message.validation.js"
import messageController from "../controller/message.controller.js"

const router = express.Router()

router
    .post("/send-message" , isAuthenticate , validate(messageValidation.create) , messageController.sendMessage )
    .get("/:reciverId" , isAuthenticate , validate(messageValidation.getMessage) , messageController.fetchMessage)

    
export const messageRouter = router;
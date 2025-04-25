import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { isAuthenticate } from "../middlewares/authentication.middleware.js";
import messageValidation from "../validations/message.validation.js";
import messageController from "../controller/message.controller.js";

const router = express.Router();

router
    .post(
        "/send-message",
        isAuthenticate,
        validate(messageValidation.create),
        messageController.sendMessage
    )
    .get(
        "/:receiverId",
        isAuthenticate,
        validate(messageValidation.getMessage),
        messageController.fetchMessage
    )
    .patch(
        "/edit/:messageId",
        isAuthenticate,
        validate(messageValidation.editMessage),
        messageController.editMessage
    )
    .delete(
        "/:messageId",
        isAuthenticate,
        validate(messageValidation.deleteMessage),
        messageController.deleteMessage
    )
    .patch(
        "/edit/react/:messageId",
        isAuthenticate,
        validate(messageValidation.updateReactMessage),
        messageController.updateReactToMessage
    )
    .patch(
        "react/:messageId",
        isAuthenticate,
        validate(messageValidation.reactMessage),
        messageController.reactToMessage
    );

export const messageRouter = router;

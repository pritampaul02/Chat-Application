import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { isAuthenticate } from "../middlewares/authentication.middleware.js";
import messageValidation from "../validations/message.validation.js";
import messageController from "../controller/message.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router
    .post(
        "/send-message",
        isAuthenticate,
        upload.any(),
        validate(messageValidation.create),
        messageController.sendMessage
    )
    .patch(
        "/read/:senderId",
        isAuthenticate,
        messageController.markAsRead
    )
    .patch(
        "/edit/react/:messageId",
        isAuthenticate,
        validate(messageValidation.updateReactMessage),
        messageController.updateReactToMessage
    )
    .patch(
        "/react/:messageId",
        isAuthenticate,
        validate(messageValidation.reactMessage),
        messageController.reactToMessage
    )
    .patch(
        "/edit/:messageId",
        isAuthenticate,
        validate(messageValidation.editMessage),
        messageController.editMessage
    )
    .delete(
        "/delete/react/:messageId",
        isAuthenticate,
        validate(messageValidation.deleteReactMessage),
        messageController.deleteReactToMessage
    )
    .delete(
        "/:messageId",
        isAuthenticate,
        validate(messageValidation.deleteMessage),
        messageController.deleteMessage
    )
    .get(
        "/:receiverId",
        isAuthenticate,
        validate(messageValidation.getMessage),
        messageController.fetchMessage
    );
export const messageRouter = router;

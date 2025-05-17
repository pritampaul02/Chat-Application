import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import messageService from "../services/message.service.js";
import { cloudinaryFileUploader } from "../utils/fileUpload.js";
import { sendResponse } from "../utils/response.handler.js";

class MessageController {
    sendMessage = async (req, res) => {
        try {
            const { id } = req.user;
            let imageData = null;

            // Upload image to Cloudinary if file exists
            if (req.file) {
                imageData = await cloudinaryFileUploader(
                    req.file.buffer,
                    req.file.mimetype,
                    "chat/messages"
                );

                if (imageData.error) {
                    throw new Error("Image upload failed");
                }
            }

            const data = await messageService.sendMessage(id, {
                ...req.body,
                image: imageData?.url || null,
                imageId: imageData?.public_id || null,
            });

            sendResponse(res, {
                status: HTTP_STATUS.CREATED,
                data,
                message: "Message sent successfully",
                success: true,
            });
        } catch (error) {
            console.error("Send Message Error:", error);
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: error.message || "Something went wrong",
                success: false,
            });
        }
    };

    fetchMessage = async (req, res) => {
        try {
            console.log("`this is fetch message api`");

            const { id } = req.user;
            const { receiverId } = req.params;
            console.log(id, receiverId);
            const data = await messageService.fetchMessage(id, receiverId);

            sendResponse(res, {
                status: HTTP_STATUS.OK,
                data: data,
                message: "message fetched successfully",
                success: true,
            });
        } catch (error) {
            console.error("error === ====  ====   ===>", error);
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                success: false,
                message: error.message || "something went wrong",
                error,
            });
        }
    };

    editMessage = async (req, res) => {
        const { id: userId } = req.user;
        const { messageId } = req.params;
        const { message } = req.body;

        const updated = await messageService.editMessage(
            userId,
            messageId,
            message
        );
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "Message updated successfully",
            data: updated,
        });
    };

    deleteMessage = async (req, res) => {
        const { id: userId } = req.user;
        const { messageId } = req.params;

        const deleted = await messageService.deleteMessage(userId, messageId);
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "Message deleted successfully",
            data: deleted,
        });
    };

    reactToMessage = async (req, res) => {
        try {
            const { id: userId } = req.user;
            const { messageId } = req.params;
            const { emoji } = req.body;

            const updated = await messageService.reactToMessage(
                userId,
                messageId,
                emoji
            );
            console.log(updated, "updated emoji");

            sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "Reaction added",
                data: updated,
            });
        } catch (error) {
            console.error("error === ====  ====   ===>", error);
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                success: false,
                message: error.message || "something went wrong",
                error,
            });
        }
    };

    updateReactToMessage = async (req, res) => {
        const { id: userId } = req.user;
        const { messageId } = req.params;
        const { emoji } = req.body;

        const updatedReact = await messageService.UpdateReactToMessage(
            userId,
            messageId,
            emoji
        );
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "Reaction added",
            data: updatedReact,
        });
    };
    deleteReactToMessage = async (req, res) => {
        const { id: userId } = req.user;
        const { messageId } = req.params;
        const { emoji } = req.body;

        const deletedReact = await messageService.deleteReactToMessage(
            userId,
            messageId,
            emoji
        );
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "Reaction deleted",
            data: deletedReact,
        });
    };
}

export default new MessageController();

import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import messageService from "../services/message.service.js";
import { sendResponse } from "../utils/response.handler.js";

class MessageController {
    sendMessage = async (req, res) => {
        try {
            const { id } = req.user;
            const data = await messageService.sendMessage(id, req.body);
            sendResponse(res, {
                status: HTTP_STATUS.CREATED,
                data: data,
                message: "message sent successfully",
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

    fetchMessage = async (req, res) => {
        try {
            console.log("`this is fetch message api`");

            const { id } = req.user;
            const { receiverId } = req.params;
            console.log(id, receiverId);
            const data = await messageService.fetchMessage(id, receiverId);
            console.log("data===", data);
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
        const { id: userId } = req.user;
        const { messageId } = req.params;
        const { emoji } = req.body;

        const updated = await messageService.reactToMessage(
            userId,
            messageId,
            emoji
        );
        sendResponse(res, {
            status: HTTP_STATUS.OK,
            success: true,
            message: "Reaction added",
            data: updated,
        });
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
}

export default new MessageController();

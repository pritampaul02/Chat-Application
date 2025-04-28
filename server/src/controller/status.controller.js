import { HTTP_STATUS } from "../constants/statusCode.constants.js";

import statusService from "../services/status.service.js";
import { sendResponse } from "../utils/response.handler.js";

class StatusController {
    createStatus = async (req, res) => {
        try {
            const { id } = req.user;
            const data = await statusService.createStatus(id, req.body);
            sendResponse(res, {
                status: HTTP_STATUS.CREATED,
                data: data,
                message: "status create successfully",
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
    getStatuses = async (req, res) => {
        try {
            const viewerId = req.user.id; // authenticated user
            const statuses = await statusService.getStatuses(viewerId);
            sendResponse(res, {
                status: HTTP_STATUS.OK,
                data: statuses,
                message: "Statuses fetched successfully",
                success: true,
            });
        } catch (error) {
            console.error("getStatuses error:", error);
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: error.message,
                success: false,
            });
        }
    };

    likeStatus = async (req, res) => {
        try {
            const { id: userId } = req.user;
            const { statusId } = req.params;
            const data = await statusService.likeStatus(userId, statusId);

            sendResponse(res, {
                status: HTTP_STATUS.OK,
                data,
                message: "Status liked successfully",
                success: true,
            });
        } catch (error) {
            console.error("likeStatus error:", error);
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: error.message,
                success: false,
            });
        }
    };

    viewStatus = async (req, res) => {
        try {
            const { id: userId } = req.user;
            const { statusId } = req.params;
            console.log("status id", statusId, req.params);
            const data = await statusService.viewStatus(userId, statusId);

            sendResponse(res, {
                status: HTTP_STATUS.OK,
                data,
                message: "Status viewed successfully",
                success: true,
            });
        } catch (error) {
            console.error("viewStatus error:", error);
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: error.message,
                success: false,
            });
        }
    };

    deleteStatus = async (req, res) => {
        try {
            const { id: userId } = req.user;
            const { statusId } = req.params;
            console.log("status id", statusId, req.params);
            const status = await statusService.deleteStatus(userId, statusId);
            console.log("controller status", status);
            if (!status) {
                return sendResponse(res, {
                    status: HTTP_STATUS.NOT_FOUND,
                    success: false,
                    message: "Status not found",
                });
            }

            // Only allow creator to delete their status
            if (status.user.toString() !== userId) {
                return sendResponse(res, {
                    status: HTTP_STATUS.FORBIDDEN,
                    success: false,
                    message: "You are not authorized to delete this status",
                });
            }

            // await statusService.deleteStatus(userId, statusId);

            sendResponse(res, {
                status: HTTP_STATUS.OK,
                message: "Status deleted successfully",
                success: true,
            });
        } catch (error) {
            console.error("deleteStatus error:", error);
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: error.message,
                success: false,
            });
        }
    };
}

export default new StatusController();

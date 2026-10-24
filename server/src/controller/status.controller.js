import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import statusService from "../services/status.service.js";
import { sendResponse } from "../utils/response.handler.js";
import { cloudinaryFileUploader } from "../utils/fileUpload.js";

class StatusController {
    createStatus = async (req, res) => {
        try {
            const { id } = req.user;
            let mediaData = null;

            const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
            if (file) {
                try {
                    mediaData = await cloudinaryFileUploader(
                        file.buffer,
                        file.mimetype,
                        "chat/status"
                    );
                } catch (uploadErr) {
                    console.error("Cloudinary status upload error:", uploadErr);
                    throw new Error("Failed to upload media file. Please try again.");
                }
            }

            const payload = {
                ...req.body,
                url: mediaData?.url || req.body.url,
                public_id: mediaData?.public_id || req.body.public_id,
                image: mediaData?.url || req.body.image || req.body.url || "",
            };

            if (req.body.isPublic !== undefined) {
                payload.isPublic = req.body.isPublic === true || req.body.isPublic === "true";
            }

            if (req.body.poll && typeof req.body.poll === "string") {
                try {
                    payload.poll = JSON.parse(req.body.poll);
                } catch (e) {}
            }

            const data = await statusService.createStatus(id, payload);
            sendResponse(res, {
                status: HTTP_STATUS.CREATED,
                data: data,
                message: "status create successfully",
                success: true,
            });
        } catch (error) {
            console.error("error in createStatus ===>", error);
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
            const viewerId = req.user._id; // authenticated user
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

            const status = await statusService.deleteStatus(userId, statusId);
            if (!status) {
                return sendResponse(res, {
                    status: HTTP_STATUS.NOT_FOUND,
                    success: false,
                    message: "Status not found",
                });
            }

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message: "Status deleted successfully",
                success: true,
                data: { statusId },
            });
        } catch (error) {
            console.error("deleteStatus error:", error);
            const statusCode = error.message?.includes("authorized")
                ? HTTP_STATUS.FORBIDDEN
                : error.message?.includes("not found")
                ? HTTP_STATUS.NOT_FOUND
                : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            return sendResponse(res, {
                status: statusCode,
                message: error.message || "Failed to delete status",
                success: false,
            });
        }
    };
}

export default new StatusController();

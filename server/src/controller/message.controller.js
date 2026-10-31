import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import messageService from "../services/message.service.js";
import { cloudinaryFileUploader } from "../utils/fileUpload.js";
import { sendResponse } from "../utils/response.handler.js";
import cloudinary from "../config/cloudinary.config.js";

class MessageController {
  sendMessage = async (req, res) => {
    try {
      const { id } = req.user;
      let imageData = null;

      const file = req.file || (req.files && req.files[0]);

      // Upload image to Cloudinary if file exists or base64 provided
      if (file) {
        imageData = await cloudinaryFileUploader(
          file.buffer,
          file.mimetype,
          "chat/messages",
        );

        if (imageData.error) {
          throw new Error("Image upload failed");
        }
      } else if (
        req.body?.image &&
        typeof req.body.image === "string" &&
        req.body.image.startsWith("data:")
      ) {
        const uploadRes = await cloudinary.uploader.upload(req.body.image, {
          folder: "chat/messages",
        });
        imageData = {
          url: uploadRes.secure_url,
          public_id: uploadRes.public_id,
        };
      }

      console.log("req.body in meg cont", req.body);

      const data = await messageService.sendMessage(id, {
        ...req.body,
        image: imageData?.url || null,
        imageId: imageData?.public_id || null,
      });
      console.log("data", data);

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
      const { id } = req.user;
      const { receiverId } = req.params;
      const data = await messageService.fetchMessage(id, receiverId);

      // Automatically mark messages from receiverId to id as read
      messageService.markMessagesAsRead(id, receiverId).catch((err) => {
        console.error("Auto markMessagesAsRead error:", err);
      });

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

  markAsRead = async (req, res) => {
    try {
      const { id } = req.user;
      const { senderId } = req.params;
      const result = await messageService.markMessagesAsRead(id, senderId);
      sendResponse(res, {
        status: HTTP_STATUS.OK,
        data: result,
        message: "messages marked as read",
        success: true,
      });
    } catch (error) {
      sendResponse(res, {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || "something went wrong",
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
      message,
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
      // console.log(req.body, "req.body");
      const updated = await messageService.reactToMessage(
        userId,
        messageId,
        emoji,
      );
      // console.log(updated, "updated emoji");

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
      emoji,
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
      emoji,
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

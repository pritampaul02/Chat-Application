
import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import messageService from "../services/message.service.js";
import { sendResponse } from "../utils/response.handler.js";


class MessageController {


   sendMessage = async (req, res) => {
      try {
         const { id } = req.user;
         const data = await messageService.sendMessage(id, req.body);
         sendResponse(res, { status: HTTP_STATUS.CREATED, data: data, message: "message sent successfully", success: true })
      } catch (error) {
         console.error("error === ====  ====   ===>", error);
         sendResponse(res, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, success: false, message: error.message || "something went wrong", error });

      }

   }

   fetchMessage = async (req, res) => {
      try {
         console.log("`this is fetch message api`");
         
         const { id } = req.user;
         const { reciverId } = req.params;
         console.log(id , reciverId);
         const data = await messageService.fetchMessage(id, reciverId);
         sendResponse(res, { status: HTTP_STATUS.OK, data: data, message: "message fetched successfully", success: true })
      } catch (error) {
         console.error("error === ====  ====   ===>", error);
         sendResponse(res, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, success: false, message: error.message || "something went wrong", error });

      }

   }



}

export default new MessageController();
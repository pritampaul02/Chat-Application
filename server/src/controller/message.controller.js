import { RESPONSE_MESSAGES } from "../constants/responseMessage.constants.js";
import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import messageService from "../services/message.service.js";

import { sendResponse } from "../utils/response.handler.js";

class MessageController {

    async create(req , res){
        try {
            const data = await messageService.create(req.body , req.user ) 
            console.info("todo created")
            return sendResponse(res , { status:HTTP_STATUS.CREATED , message : RESPONSE_MESSAGES.TODO_CREATED , success:true , data:data })
        } catch (error) {
            return sendResponse(res , { status:HTTP_STATUS.INTERNAL_SERVER_ERROR , success:false , message:RESPONSE_MESSAGES.INTERNAL_ERROR , error : error  })
        }

    }

}

export default new MessageController();

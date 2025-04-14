import express from "express"
import { validate } from "../middlewares/validate.middleware.js"
import messageValidation from "../validations/message.validation.js"
import messageController from "../controller/message.controller.js"

const router = express.Router()

router
   .post('/' , validate(messageValidation.create) ,  messageController.create  ) 
   


export  const  messageRouter = router 
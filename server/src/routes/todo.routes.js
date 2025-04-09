import express from "express"
import todoController from "../controller/todo.controller.js"
import { validate } from "../middlewares/validate.middleware.js"
import todoValidation from "../validations/todo.validation.js"

const router = express.Router()

router
   .post('/' , validate(todoValidation.create) ,  todoController.createTodo )
   .get("/" ,  todoController.getTodoList)
   .patch("/:todoId" , todoController.updateTodoData )
   .delete("/:todoId" , todoController.deleteTodo )


export  const  todoRouter = router 
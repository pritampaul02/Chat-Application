import { RESPONSE_MESSAGES } from "../constants/responseMessage.constants.js";
import { HTTP_STATUS } from "../constants/statusCode.constants.js";

import { Todos } from "../model/todo.model.js";
import todoService from "../services/todo.service.js";
import { sendResponse } from "../utils/response.handler.js";

class TodoController {
    
    // async createTodo(req, res) {
    //     try {
    //         console.log("body", req.body);
    //         const { title, description } = req.body;
            
    //         if (!title) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Title is required"
    //             });
    //         }

    //         const todo = await Todos.create({ title, description });

    //         return res.status(201).json({
    //             success: true,
    //             message: "Todo created successfully",
    //             todo
    //         });
    //     } catch (error) {
    //         console.error("Error =>", error);
    //         return res.status(500).json({
    //             success: false,
    //             message: "Internal Server Error"
    //         });
    //     }
    // }

    async createTodo(req , res){
        try {
            const data = await todoService.createTodo(req.body) 
            console.info("todo created")
            return sendResponse(res , { status:HTTP_STATUS.CREATED , message : RESPONSE_MESSAGES.TODO_CREATED , success:true , data:data })
        } catch (error) {
            return sendResponse(res , { status:HTTP_STATUS.INTERNAL_SERVER_ERROR , success:false , message:RESPONSE_MESSAGES.INTERNAL_ERROR , error : error  })
        }

    }




    async getTodoList(req, res) {
        try {
            const todos = await Todos.find();
            return res.status(200).json({
                success: true,
                message: todos.length ? "Fetched all todos" : "No todos available",
                data: todos
            });
        } catch (error) {
            console.error("Error =>", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    async updateTodoData(req, res) {
        try {
            const { todoId } = req.params;
            const { title, description, isComplete } = req.body;
            let completeDate = "";
            let todo = {};

            const todoExist = await Todos.findById(todoId);
            if (!todoExist) {
                return res.status(400).json({
                    success: false,
                    message: "Todo does not exist"
                });
            }

            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: "Title is required"
                });
            }

            if (isComplete) {
                completeDate = Date.now();
                todo = await Todos.findByIdAndUpdate(todoId, { ...req.body, completeAt: completeDate }, { new: true });
            } else {
                todo = await Todos.findByIdAndUpdate(todoId, { ...req.body, completeAt: null }, { new: true });
            }

            return res.status(200).json({
                success: true,
                message: "Todo updated successfully",
                data: todo
            });
        } catch (error) {
            console.error("Error =>", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    async deleteTodo(req, res) {
        try {
            const { todoId } = req.params;
            const todo = await Todos.findById(todoId);

            if (!todo) {
                return res.status(400).json({
                    success: false,
                    message: "Todo does not exist"
                });
            }

            await Todos.findByIdAndDelete(todoId);
            return res.status(200).json({
                success: true,
                message: "Todo deleted successfully",
                data: todo
            });
        } catch (error) {
            console.error("Error =>", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
}

export default new TodoController();

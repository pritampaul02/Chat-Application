import { Todos } from "../model/todo.model.js"

class TodoService {

    async createTodo(body){
        console.log("body" , body);
        
        const todo = await Todos.create(body)
        return todo
    }

}

export default new TodoService()
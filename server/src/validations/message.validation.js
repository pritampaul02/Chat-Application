import { z } from "zod"

// Define Zod schemas for todo validation
class MessageValidations  {
  // Schema for creating a todo
  create = z.object({
    body: z.object({
      message: z.string().trim().min(1, "Title is required"),
      reciverId:  z.string().trim().min(1, "Reciver ID is required"),
    }),
  }) 

  getMessage = z.object({
    params: z.object({
      reciverId: z.string().trim().min(1, "Reciver ID is required"),
    }),
  })

  // Schema for updating a todo
  update = z.object({
    params: z.object({
      todoId: z.string().min(1, "Todo ID is required"), // "3" ,  "som4376gf" , "67bb196ba9341c98463a89e9"
    }),
    body: z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
      isComplete: z.boolean().optional(),
    }),
  })

  // Schema for deleting a todo
  delete = z.object({
    params: z.object({
      todoId: z.string().min(1, "Todo ID is required"),
    }),
  })
}

export default new MessageValidations()


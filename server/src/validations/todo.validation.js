import { z } from "zod"

class TodoValidations {

    create = z.object({
        body: z.object({
          title: z.string().min(3 , "Title is required"),
          description: z.string().optional(),
        }).strict(),
      })

}

export default new TodoValidations()
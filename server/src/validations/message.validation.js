import { z } from "zod"

class MessageValidations  {

    create = z.object({
        body: z.object({
          reciver : z.string().trim().min(1 , "reciver must be required ") ,
          message : z.string().trim().min(1 , "message required")
        }) ,
      })

}

export default new MessageValidations()
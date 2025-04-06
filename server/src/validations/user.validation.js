import { z } from "zod"


class UserValidation {

    
    createUser = z.object({
            body: z.object({
                name: z.string().trim().min(3 , "Name is required"),
                email: z.string().trim().email("Email is required"),
                password: z.string().trim().min(8 , "Password is required"),
                profile_pic: z.string().trim().optional(),
            }).strict(),
        })
}

export default new UserValidation()
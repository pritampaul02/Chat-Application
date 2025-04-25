import { z } from "zod";

// Define Zod schemas for status validation
class StatusValidations {
    // Schema for creating a status
    createStatus = z.object({
        body: z.object({
            type: z.enum(["text", "image", "video", "link", "poll"]),
            url: z.string().url().optional(),
            public_id: z.string().optional(),
            text: z.string().optional(),
            background: z.string().optional(),
            isPublic: z.boolean().optional(),
            allowedUsers: z.array(z.string()).optional(),
            poll: z
                .object({
                    question: z.string().min(1, "Poll question is required"),
                    options: z
                        .array(z.string())
                        .min(2, "Poll must have at least 2 options"),
                    // .max(6, "Poll can have at most 6 options"),
                })
                .optional(),
        }),
    });

    // getMessage = z.object({
    //     params: z.object({
    //         reciverId: z.string().trim().min(1, "Reciver ID is required"),
    //     }),
    // });

    // // Schema for updating a todo
    // update = z.object({
    //     params: z.object({
    //         todoId: z.string().min(1, "Todo ID is required"), // "3" ,  "som4376gf" , "67bb196ba9341c98463a89e9"
    //     }),
    //     body: z.object({
    //         title: z.string().min(1, "Title is required"),
    //         description: z.string().optional(),
    //         isComplete: z.boolean().optional(),
    //     }),
    // });

    // // Schema for deleting a todo
    // delete = z.object({
    //     params: z.object({
    //         todoId: z.string().min(1, "Todo ID is required"),
    //     }),
    // });
}

export default new StatusValidations();

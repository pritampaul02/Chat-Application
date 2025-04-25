import { z } from "zod";

// Define Zod schemas for todo validation
class MessageValidations {
    // Schema for creating a todo
    create = z.object({
        body: z.object({
            sender: z.string().trim().min(1, "Sender ID is required"),
            receiver: z.string().trim().min(1, "Reciver ID is required"),
            receiverModel: z
                .string()
                .trim()
                .min(1, "Receiver model is required"),
            message: z.string().trim().min(1, "message is required"),
        }),
    });

    getMessage = z.object({
        params: z.object({
            receiverId: z.string().trim().min(1, "Reciver ID is required"),
        }),
    });

    // Schema for updating a message
    editMessage = z.object({
        params: z.object({
            messageId: z.string().trim().min(1, "message ID is required"), // "3" ,  "som4376gf" , "67bb196ba9341c98463a89e9"
        }),
        body: z.object({
            message: z.string().trim().min(1, "message is required"),
        }),
    });

    // Schema for deleting a message
    deleteMessage = z.object({
        params: z.object({
            messageId: z.string().trim().min(1, "message ID is required"),
        }),
    });
    // schema for add reation on a message
    reactMessage = z.object({
        params: z.object({
            messageId: z.string().trim().min(1, "message ID is required"),
        }),
        body: z.object({
            emoji: z.string().trim().min(1, "Emoji is required"),
        }),
    });
    updateReactMessage = z.object({
        params: z.object({
            messageId: z.string().trim().min(1, "message ID is required"),
        }),
        body: z.object({
            emoji: z.string().trim().min(1, "Emoji is required"),
        }),
    });
}

export default new MessageValidations();

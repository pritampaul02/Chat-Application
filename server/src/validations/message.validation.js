import { z } from "zod";

// Define Zod schemas for message validation
class MessageValidations {
    // Schema for creating / sending a message
    create = z.object({
        body: z
            .object({
                receiver: z.string().trim().optional(),
                receiverId: z.string().trim().optional(),
                receiverModel: z.string().trim().optional().default("user"),
                message: z.string().optional().default(""),
                image: z.string().optional().nullable(),
            })
            .passthrough()
            .refine((data) => data.receiver || data.receiverId, {
                message: "Receiver ID is required",
                path: ["receiver"],
            }),
    });

    getMessage = z.object({
        params: z.object({
            receiverId: z.string().trim().min(1, "Receiver ID is required"),
        }),
    });

    // Schema for updating a message
    editMessage = z.object({
        params: z.object({
            messageId: z.string().trim().min(1, "Message ID is required"),
        }),
        body: z.object({
            message: z.string().trim().min(1, "Message is required"),
        }),
    });

    // Schema for deleting a message
    deleteMessage = z.object({
        params: z.object({
            messageId: z.string().trim().min(1, "Message ID is required"),
        }),
    });

    // Schema for add reaction on a message
    reactMessage = z.object({
        params: z.object({
            messageId: z.string().trim().min(1, "Message ID is required"),
        }),
        body: z.object({
            emoji: z.string().trim().min(1, "Emoji is required"),
        }),
    });

    updateReactMessage = z.object({
        params: z.object({
            messageId: z.string().trim().min(1, "Message ID is required"),
        }),
        body: z.object({
            emoji: z.string().trim().min(1, "Emoji is required"),
        }),
    });

    deleteReactMessage = z.object({
        params: z.object({
            messageId: z.string().trim().min(1, "Message ID is required"),
        }),
        body: z
            .object({
                emoji: z.string().trim().optional(),
            })
            .optional(),
    });
}

export default new MessageValidations();


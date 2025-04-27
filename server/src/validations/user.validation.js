import { z } from "zod";

class UserValidation {
    createUser = z.object({
        body: z.object({
            name: z.string().trim().min(1, "Name is required"),
            email: z.string().trim().email("Invalid email format"),
            password: z
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters"),
        }),
    });

    login = z.object({
        body: z.object({
            email: z
                .string()
                .email("Invalid email format")
                .trim()
                .min(1, "email is required "),
            password: z
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters"),
        }),
    });

    sendOtp = z.object({
        body: z.object({
            email: z.string().email("Invalid email format"),
        }),
    });

    verifyOtp = z.object({
        body: z.object({
            otp: z.string().length(6, "OTP must be 6 digits"),
        }),
    });

    changeProfilePic = z.object({
        body: z.object({
            file: z.any(), // You might want to use a more specific validation for files
        }),
    });

    changeCover = z.object({
        body: z.object({
            file: z.any(), // You might want to use a more specific validation for files
        }),
    });

    changeBio = z.object({
        body: z.object({
            bio: z.string().trim().min(1, "bio is required"), // You might want to use a more specific validation for files
        }),
    });

    changeLocation = z.object({
        body: z.object({
            place: z.string().trim().min(1, "bio is required"), // You might want to use a more specific validation for files
        }),
    });

    updateUserRole = z.object({
        params: z.object({
            userId: z.string().min(1, "User ID is required"),
        }),
        body: z.object({
            newRole: z.enum(["user", "admin", "controller"], {
                errorMap: () => ({ message: "Invalid role" }),
            }),
        }),
    });

    addTwoStepVerification = z.object({
        body: z.object({
            isTwoStepAuth: z.boolean(),
        }),
    });

    updateUser = z.object({
        params: z.object({
            id: z.string().min(1, "User ID is required"),
        }),
        body: z.object({
            // Add fields that can be updated
            name: z.string().optional(),
            email: z.string().email("Invalid email format").optional(),
            // Add other fields as needed
        }),
    });

    forgotPassword = z.object({
        body: z.object({
            email: z.string().email("Invalid email format"),
        }),
    });

    changePasswordWithOtp = z.object({
        body: z.object({
            otp: z.string().length(6, "OTP must be 6 digits"),
            password: z
                .string()
                .min(8, "Password must be at least 8 characters"),
        }),
    });

    changePasswordWithOldPassword = z.object({
        body: z.object({
            oldPassword: z.string().min(1, "Old password is required"),
            newPassword: z
                .string()
                .min(8, "New password must be at least 8 characters"),
        }),
    });

    sendFriendRequest = z.object({
        body: z.object({
            requastId: z.string().min(1, "request Id is must  be required "),
        }),
    });
    manageFriendRequest = z.object({
        body: z.object({
            requestId: z.string().min(1, "Request ID is required"),
            action: z.enum(["accept", "reject"], {
                errorMap: () => ({ message: "Invalid action" }),
            }),
        }),
    });
}

export default new UserValidation();

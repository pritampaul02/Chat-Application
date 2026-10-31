import mongoose, { Schema } from "mongoose";

const pushSubscriptionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true,
        },
        endpoint: {
            type: String,
            required: true,
            unique: true,
        },
        keys: {
            p256dh: {
                type: String,
                required: true,
            },
            auth: {
                type: String,
                required: true,
            },
        },
        expirationTime: {
            type: Number,
            default: null,
        },
        device: {
            type: String,
            default: "browser",
        },
        userAgent: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

pushSubscriptionSchema.index({ user: 1, isActive: 1 });

export const PushNotification = mongoose.model(
    "PushNotification",
    pushSubscriptionSchema
);
export const PushSubscriptions = PushNotification;
export default PushNotification;

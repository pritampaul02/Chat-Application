import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "receiverModel", // "User" or "Group"
            required: true,
        },

        receiverModel: {
            type: String,
            required: true,
            enum: ["User", "Group"],
        },

        message: {
            type: String,
            trim: true,
            default: "",
        },

        type: {
            type: String,
            enum: [
                "text",
                "image",
                "video",
                "file",
                "audio",
                "location",
                "poll",
                "sticker",
                "mention",
                "system",
            ],
            default: "text",
        },

        media: {
            url: String,
            public_id: String,
            fileType: String,
            fileName: String,
        },

        reactions: [
            {
                emoji: String,
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                reactedAt: { type: Date, default: Date.now },
            },
        ],

        isRead: {
            type: Boolean,
            default: false,
        },

        readBy: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                readAt: { type: Date, default: Date.now },
            },
        ],

        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "message",
            default: null,
        },

        forwardedFrom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        mentions: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            },
        ],

        poll: {
            question: String,
            options: [String],
            votes: [
                {
                    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                    optionIndex: Number,
                },
            ],
        },

        location: {
            lat: Number,
            lng: Number,
            address: String,
        },

        scheduleAt: {
            type: Date,
            default: null,
        },

        selfDestructAt: {
            type: Date,
            default: null,
        },

        edited: { type: Boolean, default: false },
        deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const  Messages = mongoose.model("message", messageSchema);

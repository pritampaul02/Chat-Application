import mongoose from "mongoose";
import { Users } from "./user.model.js";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "receiverModel", // "user" or "Group"
            required: true,
        },

        receiverModel: {
            type: String,
            required: true,
            enum: ["user", "Group"],
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
                user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
                reactedAt: { type: Date, default: Date.now },
            },
        ],

        isRead: {
            type: Boolean,
            default: false,
        },

        readBy: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
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
            ref: "user",
            default: null,
        },

        mentions: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            },
        ],

        poll: {
            question: String,
            options: [String],
            votes: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "user",
                    },
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
        editedAt: { type: Date },

        deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Messages = mongoose.model("message", messageSchema);

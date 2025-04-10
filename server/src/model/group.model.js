import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Group name is required"],
            trim: true,
            minlength: 3,
        },

        description: {
            type: String,
            default: "",
            maxlength: 1000,
            trim: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                role: {
                    type: String,
                    enum: ["admin", "moderator", "member"],
                    default: "member",
                },
                joinedAt: { type: Date, default: Date.now },
                isMuted: { type: Boolean, default: false },
                notifications: { type: Boolean, default: true },
                lastSeen: { type: Date, default: null },
            },
        ],

        image: {
            url: { type: String, default: "https://via.placeholder.com/150" },
            public_id: { type: String, default: null },
        },

        // banner: {
        //     url: { type: String, default: "" },
        //     public_id: { type: String, default: null },
        // },

        isPrivate: { type: Boolean, default: false },
        inviteCode: { type: String, unique: true, sparse: true },

        categories: [
            {
                name: { type: String, required: true },
                channels: [
                    {
                        name: { type: String, required: true },
                        type: {
                            type: String,
                            enum: ["text", "voice", "announcement"],
                            default: "text",
                        },
                        createdAt: { type: Date, default: Date.now },
                    },
                ],
            },
        ],

        settings: {
            allowMedia: { type: Boolean, default: true },
            allowMentions: { type: Boolean, default: true },
            allowThreads: { type: Boolean, default: false },
            onlyAdminsCanPost: { type: Boolean, default: false },
            allowVoice: { type: Boolean, default: true },
            enablePolls: { type: Boolean, default: false },
            enableJoinRequests: { type: Boolean, default: false },
        },

        pinnedMessages: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },

        bannedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        announcements: [
            {
                title: String,
                content: String,
                postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                createdAt: { type: Date, default: Date.now },
            },
        ],

        reactions: {
            enabled: { type: Boolean, default: true },
            available: {
                type: [String],
                default: ["👍", "❤️", "🔥", "😂", "🎉", "😢"],
            },
        },

        groupStatus: {
            isArchived: { type: Boolean, default: false },
            deletedAt: { type: Date, default: null },
            isVerified: { type: Boolean, default: false },
        },

        themes: {
            color: { type: String, default: "#1ea776" },
            darkMode: { type: Boolean, default: false },
            font: { type: String, default: "sans-serif" },
        },

        activity: {
            messageCount: { type: Number, default: 0 },
            activeUsers: { type: Number, default: 0 },
            lastActive: { type: Date, default: Date.now },
        },

        // integrations: {
        //     slackWebhook: { type: String, default: null },
        //     discordWebhook: { type: String, default: null },
        //     githubRepoLink: { type: String, default: null },
        // },
    },
    { timestamps: true }
);

export const Group = mongoose.model("Group", groupSchema);

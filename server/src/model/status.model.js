import mongoose from "mongoose";

const statusSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: ["image", "video", "text", "link", "poll"],
            required: true,
        },

        media: {
            url: {
                type: String,
                required: function () {
                    return this.type !== "text";
                },
            },
            public_id: {
                type: String,
            },
        },

        text: {
            type: String,
            trim: true,
            default: "",
        },

        background: {
            type: String, // for text statuses, eg. color or gradient
        },

        views: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                viewedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        likes: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                likedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        poll: {
            question: String,
            options: [String],
            votes: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                    },
                    optionIndex: Number,
                    votedAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
        },

        isPublic: {
            type: Boolean,
            default: true,
        },

        allowedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        expiry: {
            type: Date,
            default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    },
    {
        timestamps: true,
    }
);
export const Status = mongoose.model("Status", statusSchema);

// Feature	            Benefit
//
// username	            Unique handle for profile link or tagging.
// bio	                Short intro for profile.
// isVerified	          For email or KYC verification.
// status	              To manage banned or deactivated accounts.
// twoFactorEnabled	    Future-proof for security.
// deviceTokens	        For FCM/OneSignal push notifications.
// deletedAt	          Soft delete support.

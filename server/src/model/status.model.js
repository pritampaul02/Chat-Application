import mongoose from "mongoose";

const statusSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
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
                    ref: "user",
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
                    ref: "user",
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
                        ref: "user",
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
                ref: "user",
            },
        ],

        expiry: {
            type: Date,
            default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // remove after 1 day

            index: { expires: 0 },
        },
    },
    {
        timestamps: true,
    }
);
export const Status = mongoose.model("Statu", statusSchema);

// Feature	            Description
// views	              Track which users saw the status and when.
// poll	                Add interactive polls inside status (like Instagram).
// allowedUsers	        Fine-grained privacy – only selected users can view.
// background	          Useful for text statuses with styled backgrounds.
// isPublic toggle	    Allow public/private status sharing.
// text field	          Now supports both media & text combo (for captions).

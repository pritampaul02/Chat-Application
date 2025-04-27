import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Schema Definition
const userSchema = new Schema(
    {
        name: {
            type: String,
            maxLength: [60, "Name should be less than 60 characters"],
            minLength: [3, "Name must be at least 3 characters"],
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please provide a valid email address",
            ],
            trim: true,
        },

        password: {
            type: String,
            minLength: [8, "Password must be 8 characters or more"],
            required: [true, "Password is required"],
            select: false,
        },

        profile_pic: {
            url: {
                type: String,
                default:
                    "https://res.cloudinary.com/dab0ekhmy/image/upload/v1728130610/thik-ai/gvjpvq3xljmnw2vwdkag.avif",
            },
            public_id: {
                type: String,
                default: null,
            },
        },
        coverPhoto: {
            url: {
                type: String,
                default:
                    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwallpapercave.com%2Fnature-laptop-wallpapers&psig=AOvVaw3NYwdNJQiooWKqgBTSBS5-&ust=1745733552378000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMCbsbiC9YwDFQAAAAAdAAAAABAJ",
            },
            public_id: {
                type: String,
                default: null,
            },
        },

        bio: {
            type: String,
            maxLength: 160,
            default: "",
        },

        role: {
            type: String,
            enum: ["user", "admin", "moderator"],
            default: "user",
        },

        status: {
            type: String,
            enum: ["active", "deactivated", "banned"],
            default: "active",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        location: {
            // city: String,
            // country: String,
            place: String,
        },

        deviceTokens: [String], // for push notifications

        friends: [{ type: Schema.Types.ObjectId, ref: "user" }],
        friendRequests: [{ type: Schema.Types.ObjectId, ref: "user" }],
        sentFriendRequests: [{ type: Schema.Types.ObjectId, ref: "user" }],

        isOnline: {
            type: Boolean,
            default: false,
        },

        lastSeen: {
            type: Date,
            default: null,
        },

        twoFactorEnabled: {
            type: Boolean,
            default: false,
        },
        isTwoStepAuth: {
            type: Boolean,
            default: false,
        },

        otp: {
            type: String,
        },

        otpExpiry: {
            type: Date,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// password hashing ...
userSchema.pre("save", async function (next) {
    // if password is  modified
    // update password ( forget , reset) then password modified ,
    // if first time i create a user then
    if (!this.isModified("password")) {
        return next();
    }
    try {
        // hashing password
        this.password = await bcrypt.hash(this.password, 16);
        next();
    } catch (error) {
        return next(error);
    }
});

// create comparePassword function...
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const Users = model("user", userSchema);

// Feature	            Benefit
//
// username	            Unique handle for profile link or tagging.
// bio	                Short intro for profile.
// isVerified	          For email or KYC verification.
// status	              To manage banned or deactivated accounts.
// twoFactorEnabled	    Future-proof for security.
// deviceTokens	        For FCM/OneSignal push notifications.
// deletedAt	          Soft delete support.

import jwt from "jsonwebtoken";
import { Users } from "../model/user.model.js";

export const isAuthenticate = async (req, res, next) => {
    try {
        let token = req?.cookies?.token;

        if (!token && req.headers?.authorization) {
            token = req.headers.authorization;
            if (token.startsWith("Bearer ")) {
                token = token.slice(7).trim();
            }
        }

        if (!token && req.headers?.cookie) {
            const match = req.headers.cookie.match(/(?:^|;\s*)token=([^;]+)/);
            if (match) token = match[1];
        }

        if (!token && req.headers?.["x-access-token"]) {
            token = req.headers["x-access-token"];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated, please login first!",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded._id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Authentication failed!",
            });
        }

        const user = await Users.findById(decoded._id).select("-password").lean();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User session expired or user not found. Please log in again.",
            });
        }

        req.user = user;
        req.user.id = user._id.toString();
        next();
    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(400).json({
            success: false,
            message: "User not authenticated",
            error: error.message,
        });
    }
};

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.user;

        if (allowedRoles.includes(role)) {
            console.info("Access granted");
            next();
        } else {
            console.error("Access denied");
            res.status(403).json({
                message:
                    "Access denied. You do not have the required permissions.",
            });
        }
    };
};

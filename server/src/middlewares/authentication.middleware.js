import jwt from "jsonwebtoken";
import { Users } from "../model/user.model.js";

export const isAuthenticate = async (req, res, next) => {
    try {
        let token = req?.cookies?.token
            ? req?.cookies?.token
            : req.headers?.authorization || req.headers.cookie.split("=")[1];
        console.log("token====>", token);

        if (!token) {
            console.log("User not authenticated");
            return res.status(401).json({
                success: false,
                message: "User not authenticated, please login first!",
            });
        }

        // Fix: Extract token from 'Bearer <token>'
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Authentication failed!",
            });
        }

        // Fix: Exclude password when fetching the user
        req.user = await Users.findById(decoded._id).select("-password");

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

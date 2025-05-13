import "dotenv/config";
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { UserService } from "../services/user.service.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // TODO: restrict in production
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {}; // { userId: socketId }

// Socket.io connection
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
        console.warn("Socket connected without userId");
        return;
    }

    console.log("✅ User connected:", userId);
    userSocketMap[userId] = socket.id;

    // Update DB status
    UserService.userStatusChanger(userId, "online");

    // Notify all clients of online users
    io.emit("onlineUsers", Object.keys(userSocketMap));

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", userId);
        delete userSocketMap[userId];
        UserService.userStatusChanger(userId, "offline");
        io.emit("onlineUsers", Object.keys(userSocketMap));
    });

    // You can add other socket events like typing, seen, etc. here
});

// Utility function to get a socket ID by userId
const getSocketId = (userId) => {
    return userSocketMap[userId];
};

export { io, app, server, getSocketId };

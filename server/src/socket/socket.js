import "dotenv/config";
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { UserService } from "../services/user.service.js";
import messageService from "../services/message.service.js";
import { sendCallPushNotification } from "../utils/webPush.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // TODO: restrict in production
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {}; // { userId: socketId }
const socketUserMap = {}; // { socketId: userId }
const activeCalls = {}; // { callerId: receiverId }
const groupRooms = {}; // { roomId: Set of { socketId, userId, userName, userAvatar } }

// Socket.io connection
io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId || userId === "undefined" || userId === "null") {
        console.warn("Socket connected without valid userId");
        return;
    }

    console.log("✅ User connected:", userId, "Socket ID:", socket.id);
    userSocketMap[userId] = socket.id;
    socketUserMap[socket.id] = userId;

    // Update DB status
    UserService.userStatusChanger(userId, "online");

    // Mark pending sent messages as delivered to this user
    try {
        await messageService.markMessagesAsDelivered(userId);
    } catch (err) {
        console.error("Error delivering pending messages:", err);
    }

    // Notify all clients of online users
    io.emit("onlineUsers", Object.keys(userSocketMap));

    // ==========================================
    // Real-Time Read Receipts (Blue Ticks)
    // ==========================================
    socket.on("messages:mark-read", async ({ senderId }) => {
        try {
            if (userId && senderId) {
                await messageService.markMessagesAsRead(userId, senderId);
            }
        } catch (err) {
            console.error("Socket mark-read error:", err);
        }
    });

    // ==========================================
    // Typing Indicators
    // ==========================================
    socket.on("typing:start", ({ receiverId, senderName }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing:start", {
                senderId: userId,
                senderName,
            });
        }
    });

    socket.on("typing:stop", ({ receiverId }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing:stop", {
                senderId: userId,
            });
        }
    });

    // ==========================================
    // 1-on-1 Voice & Video Call Signaling (WebRTC)
    // ==========================================
    socket.on("call:initiate", ({ userToCall, signalData, callType, callerName, callerAvatar }) => {
        const calleeSocketId = userSocketMap[userToCall];
        console.log(`📞 Call initiated from ${userId} (${callerName}) to ${userToCall} [${callType}]`);

        if (!calleeSocketId) {
            console.log(`⚠️ Callee ${userToCall} is offline. Sending call push notification...`);
            sendCallPushNotification({
                calleeId: userToCall,
                callerId: userId,
                callerName,
                callerAvatar,
                callType: callType || "voice",
            });
            socket.emit("call:unavailable", {
                reason: "User is offline. A notification was sent to their device.",
                sentPush: true,
            });
            return;
        }

        // Check if callee is already engaged in another call
        if (activeCalls[userToCall] && activeCalls[userToCall] !== userId) {
            console.log(`⚠️ Callee ${userToCall} is busy in another call`);
            socket.emit("call:busy", {
                receiverId: userToCall,
                reason: "User is busy on another call",
            });
            return;
        }

        activeCalls[userId] = userToCall;
        io.to(calleeSocketId).emit("call:incoming", {
            signal: signalData,
            from: userId,
            callerName,
            callerAvatar,
            callType: callType || "voice",
        });
    });

    socket.on("call:accept", ({ to, signal }) => {
        const callerSocketId = userSocketMap[to];
        console.log(`📞 Call accepted by ${userId} for ${to}`);
        activeCalls[userId] = to;
        activeCalls[to] = userId;
        if (callerSocketId) {
            io.to(callerSocketId).emit("call:accepted", {
                signal,
                from: userId,
            });
        }
    });

    socket.on("call:ice-candidate", ({ to, candidate }) => {
        const targetSocketId = userSocketMap[to];
        if (targetSocketId && candidate) {
            io.to(targetSocketId).emit("call:ice-candidate", {
                candidate,
                from: userId,
            });
        }
    });

    socket.on("call:reject", ({ to }) => {
        const callerSocketId = userSocketMap[to];
        console.log(`❌ Call rejected by ${userId} for ${to}`);
        delete activeCalls[to];
        delete activeCalls[userId];
        if (callerSocketId) {
            io.to(callerSocketId).emit("call:rejected", { from: userId });
        }
    });

    socket.on("call:end", ({ to }) => {
        const targetSocketId = userSocketMap[to];
        console.log(`📴 Call ended by ${userId}`);
        delete activeCalls[to];
        delete activeCalls[userId];
        if (targetSocketId) {
            io.to(targetSocketId).emit("call:ended", { from: userId });
        }
    });

    // ==========================================
    // Group Calling Signaling (WebRTC Rooms)
    // ==========================================
    socket.on("group-call:join", ({ roomId, user }) => {
        socket.join(roomId);
        if (!groupRooms[roomId]) {
            groupRooms[roomId] = [];
        }

        // Add user if not already in list
        const existingIdx = groupRooms[roomId].findIndex(u => u.userId === userId);
        const participantInfo = {
            socketId: socket.id,
            userId,
            name: user?.name || "Participant",
            profile_pic: user?.profile_pic || null,
        };

        if (existingIdx !== -1) {
            groupRooms[roomId][existingIdx] = participantInfo;
        } else {
            groupRooms[roomId].push(participantInfo);
        }

        console.log(`👥 User ${userId} joined group call room: ${roomId}`);

        // Send existing participants to the newly joined user
        const otherParticipants = groupRooms[roomId].filter(u => u.socketId !== socket.id);
        socket.emit("group-call:all-participants", otherParticipants);

        // Notify other participants in the room that a new user joined
        socket.to(roomId).emit("group-call:user-joined", participantInfo);
    });

    socket.on("group-call:signal", ({ toSocketId, signal, fromUser }) => {
        io.to(toSocketId).emit("group-call:signal", {
            signal,
            fromSocketId: socket.id,
            fromUser,
        });
    });

    socket.on("group-call:leave", ({ roomId }) => {
        socket.leave(roomId);
        if (groupRooms[roomId]) {
            groupRooms[roomId] = groupRooms[roomId].filter(u => u.socketId !== socket.id);
            if (groupRooms[roomId].length === 0) {
                delete groupRooms[roomId];
            } else {
                io.to(roomId).emit("group-call:user-left", {
                    socketId: socket.id,
                    userId,
                });
            }
        }
        console.log(`👥 User ${userId} left group call room: ${roomId}`);
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
        const uId = socketUserMap[socket.id];
        console.log("❌ User disconnected:", uId);
        if (uId) {
            await UserService.updateLastLogin(uId);
            delete userSocketMap[uId];
            UserService.userStatusChanger(uId, "offline");
            io.emit("onlineUsers", Object.keys(userSocketMap));

            // Clean up any ongoing calls
            const partnerId = activeCalls[uId];
            if (partnerId) {
                const partnerSocket = userSocketMap[partnerId];
                if (partnerSocket) {
                    io.to(partnerSocket).emit("call:ended", { from: uId });
                }
                delete activeCalls[uId];
                delete activeCalls[partnerId];
            }
        }
        delete socketUserMap[socket.id];

        // Clean up from group rooms
        for (const roomId of Object.keys(groupRooms)) {
            const index = groupRooms[roomId].findIndex(u => u.socketId === socket.id);
            if (index !== -1) {
                groupRooms[roomId].splice(index, 1);
                io.to(roomId).emit("group-call:user-left", {
                    socketId: socket.id,
                    userId: uId,
                });
                if (groupRooms[roomId].length === 0) {
                    delete groupRooms[roomId];
                }
            }
        }
    });
});

// Utility function to get a socket ID by userId
const getSocketId = (userId) => {
    return userSocketMap[userId];
};

export { io, app, server, getSocketId };


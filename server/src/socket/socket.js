import "dotenv/config";
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { UserService } from "../services/user.service.js";


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSocketMap = {
    // userId : socketId,
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("socket connection ======> " , userId );
  const user = UserService.userStatusChanger(userId , true)

  if (!userId) return;

  userSocketMap[userId] = socket.id;

  io.emit("onlineUsers", Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
    const user = UserService.userStatusChanger(userId , true)

  });
});

const getSocketId = (userId) =>{
    return userSocketMap[userId];
}

export { io, app, server, getSocketId };

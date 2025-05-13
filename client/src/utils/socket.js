import { io } from "socket.io-client";

const SOCKET_URL = "ws://localhost:5000"; // Replace with your server URL

const myUser = JSON.parse(sessionStorage.getItem("myUser"));
const socket = io(SOCKET_URL, {
    query: {
        userId: myUser?._id,
    },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

socket.on("connection", () => {
    console.log("Socket connected with ID:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Socket disconnected");
});

export default socket;

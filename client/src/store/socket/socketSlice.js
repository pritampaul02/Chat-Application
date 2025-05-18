
// socket.js
import { io } from "socket.io-client";

let socket;

export const initializeSocket = ({userId}) => {
  socket = io(import.meta.env.VITE_BACKEND_BASE_URI,
    {
      query: {
        userId: userId,
      },
    }
  ); // your server URL
  console.log("socket connect success ", socket);

  return socket;
};

export const getSocket = () => socket;

import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { loadUser } from "../store/auth/authActions";
import { fetchChaListFriends } from "../store/chatList/chatAction";

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const dispatch = useDispatch();
  const SOCKET_URL = "ws://localhost:5001"; // Replace with your server URL
  const [socket, setSocket] = useState(null);

  const handleConnect = (socket) => {
    console.log("Socket connected with ID:", socket.id);
  }

  const handleDisconnect = (socket) => {
    console.log("Socket disconnected with ID:", socket.id);
  }

  const handleStatus = (socket) => {
    console.log("Socket status with ID:", socket.id);
    dispatch(fetchChaListFriends());
  }

  
  useEffect(() => {
      const myUser = JSON.parse(sessionStorage.getItem("myUser"));
      const socketClient = io(SOCKET_URL, {
        query: {
          userId: myUser?._id,
        },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      setSocket(socketClient);
  }, [])

  useEffect(() => {
    console.log("Socket changing")
    if (!socket) return;
      socket.on("connection", handleConnect);
    
      socket.on("disconnect", handleDisconnect);
    
      socket.on("onlineUsers", handleStatus);

      return () => {
        socket.off("connection", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("onlineUsers", handleStatus);
      }
  }, [socket])

  return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};

import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useRoomStore } from "../store/roomStore";

export const useSocket = (roomId) => {
  const socketRef = useRef(null);
  const { setFiles, addFile, setUserCount } = useRoomStore();

  useEffect(() => {
    if (!roomId) return;

    socketRef.current = io("http://localhost:5000");

    socketRef.current.emit("join-room", { roomId });

    socketRef.current.on("room-users", (count) => {
      setUserCount(count);
    });

    socketRef.current.on("room-history", (history) => {
      setFiles(history);
    });

    socketRef.current.on("new-file", (file) => {
      addFile(file);
    });

    socketRef.current.on("error", (err) => {
      console.error(err.message);
    });

    return () => {
      socketRef.current.emit("leave-room", { roomId });
      socketRef.current.disconnect();
    };
  }, [roomId]);
};
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useRoomStore } from "../store/roomStore";
import { getRoomSize } from "../services/roomService";

export const useSocket = (roomId) => {
  const socketRef = useRef(null);
  const { setFiles, addFile, setUserCount, setStorage } = useRoomStore();

  useEffect(() => {
    if (!roomId) return;

    socketRef.current = io("http://localhost:5000");

    socketRef.current.emit("join-room", { roomId });

    socketRef.current.on("room-users", (count) => {
      setUserCount(count);
    });

    socketRef.current.on("room-history", async (history) => {
      setFiles(history);
      const sizeRes = await getRoomSize(roomId);
      setStorage(sizeRes.sizeMB);
    });

    socketRef.current.on("new-file", async (file) => {
      addFile(file);
      const sizeRes = await getRoomSize(roomId);
      setStorage(sizeRes.sizeMB);
    });

    socketRef.current.on("file-deleted", async (fileId) => {
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
      const sizeRes = await getRoomSize(roomId);
      setStorage(sizeRes.sizeMB);
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

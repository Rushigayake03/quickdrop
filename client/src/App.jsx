import { useEffect } from "react";
import { io } from "socket.io-client";

export default function App() {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      const roomId = prompt("Enter Room ID");
      socket.emit("join-room", roomId);
    });

    socket.on("room-users", (count) => {
      console.log("User count:", count);
    });

    socket.on("new-file", (file) => {
      console.log("🔥 New file received:", file);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-xl font-bold">
        Socket Test Running...
      </h1>
    </div>
  );
}
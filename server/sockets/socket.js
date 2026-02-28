import { getRoomFileHistory } from "../services/file.js";
import { validateRoomExists } from "../services/roomService.js";
import { redisClient } from "../config/redis.js";

let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized");
  }
  return ioInstance;
};

const setupSocketHandlers = (socket) => {

  socket.on("join-room", async (payload) => {
    try {
      if (!payload || typeof payload !== "object") {
        socket.emit("error", {
          success: false,
          message: "Invalid join payload"
        });
        return;
      }

      const { roomId } = payload;

      if (!roomId) {
        socket.emit("error", {
          success: false,
          message: "Room ID is required"
        });
        return;
      }

      await validateRoomExists(roomId);

      socket.join(roomId);

      await redisClient.sAdd(`room:${roomId}:users`, socket.id);

      const userCount = await redisClient.sCard(`room:${roomId}:users`);

      ioInstance.to(roomId).emit("room-users", userCount);

      const history = await getRoomFileHistory(roomId);

      socket.emit("room-history", history);

    } catch (error) {
      socket.emit("error", {
        success: false,
        message: error.message
      });
    }
  });


  socket.on("leave-room", async (payload) => {
    try {
      if (!payload || typeof payload !== "object") {
        return;
      }

      const { roomId } = payload;

      if (!roomId) return;

      await redisClient.sRem(`room:${roomId}:users`, socket.id);

      socket.leave(roomId);

      const userCount = await redisClient.sCard(`room:${roomId}:users`);

      ioInstance.to(roomId).emit("room-users", userCount);

    } catch (error) {
      socket.emit("error", {
        success: false,
        message: "Failed to leave room"
      });
    }
  });


  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);
  });

};
export default setupSocketHandlers;
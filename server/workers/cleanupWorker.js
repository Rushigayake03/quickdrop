import Room from "../models/room.js";
import File from "../models/file.js";
import { redisClient } from "../config/redis.js";
import fs from "fs";
import path from "path";

const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

const deletePhysicalFile = (filename) => {
  const filePath = path.resolve("uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const cleanupExpiredRooms = async () => {
  try {
    console.log("Running cleanup worker...");

    const rooms = await Room.find({}).lean();

    for (const room of rooms) {
      const redisExists = await redisClient.exists(`room:${room.roomId}`);

      if (!redisExists) {
        console.log(`Cleaning expired room: ${room.roomId}`);

        // Get files before deleting
        const files = await File.find({ roomId: room.roomId }).lean();

        // Delete physical files
        for (const file of files) {
          deletePhysicalFile(file.filename);
        }

        // Delete file metadata
        await File.deleteMany({ roomId: room.roomId });

        // Delete room document
        await Room.deleteOne({ roomId: room.roomId });
      }
    }

  } catch (error) {
    console.error("Cleanup worker error:", error.message);
  }
};

export const startCleanupWorker = () => {
  setInterval(cleanupExpiredRooms, CLEANUP_INTERVAL);
};
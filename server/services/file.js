import File from "../models/file.js";
import { redisClient } from "../config/redis.js";

import path from "path";
import fs from "fs";

export const getFileByIdService = async (fileId) => {
  const file = await File.findById(fileId);

  if (!file) {
    throw new Error("File not found");
  }

  const filePath = path.resolve(
    "uploads",
    file.filename
  );

  if (!fs.existsSync(filePath)) {
    throw new Error("File missing on server");
  }

  return { file, filePath };
};

export const uploadFileService = async (
  roomId,
  fileData
) => {
  const newFile = await File.create({
    roomId,
    filename: fileData.filename,
    originalName: fileData.originalname,
    mimeType: fileData.mimetype,
    size: fileData.size,
  });

  // Push metadata to Redis list
  await redisClient.rPush(
    `room:${roomId}:files`,
    JSON.stringify(newFile)
  );

  // Set TTL 1 hour
  await redisClient.expire(
    `room:${roomId}:files`,
    60 * 60
  );

  return newFile;
};

export const getRoomFilesService = async (roomId) => {
  const cached = await redisClient.lRange(
    `room:${roomId}:files`,
    0,
    -1
  );

  if (cached.length > 0) {
    return cached.map((file) => JSON.parse(file));
  }

  const files = await File.find({ roomId });

  if (files.length > 0) {
    for (const file of files) {
      await redisClient.rPush(
        `room:${roomId}:files`,
        JSON.stringify(file)
      );
    }

    await redisClient.expire(
      `room:${roomId}:files`,
      60 * 60
    );
  }

  return files;
};
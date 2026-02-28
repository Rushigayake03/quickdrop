import File from "../models/file.js";
import { redisClient } from "../config/redis.js";

import path from "path";
import fs from "fs";
import { validateRoomExists } from "./roomService.js";
import { ROOM_STORAGE_LIMIT } from "../constants/limits.js";

export const getFileByIdService = async (fileId) => {
  const file = await File.findById(fileId);

  if (!file) {
    throw new Error("File not found");
  }

  const filePath = path.resolve("uploads", file.filename);

  if (!fs.existsSync(filePath)) {
    throw new Error("File missing on server");
  }

  return { file, filePath };
};


export const uploadFileService = async (roomId, fileData) => {
  await validateRoomExists(roomId);

  const redisFilesKey = `room:${roomId}:files`;
  const redisSizeKey = `room:${roomId}:size`;

  const fileSize = fileData.size;

  // 1. Get current room size
  const currentSize = Number(await redisClient.get(redisSizeKey)) || 0;

  // 2. Check limit
  if (currentSize + fileSize > ROOM_STORAGE_LIMIT) {
    throw new Error("Room storage limit (100MB) exceeded");
  }

  // 3. Increment size atomically
  await redisClient.incrBy(redisSizeKey, fileSize);

  // Ensure size key expires with room
  await redisClient.expire(redisSizeKey, 60 * 60 * 24);

  try {
    // 4. Save to Mongo
    const newFile = await File.create({
      roomId,
      filename: fileData.filename,
      originalName: fileData.originalname,
      mimeType: fileData.mimetype,
      size: fileData.size,
    });

    // 5. Cache file metadata
    await redisClient.rPush(
      redisFilesKey,
      JSON.stringify(newFile.toObject())
    );

    await redisClient.expire(redisFilesKey, 3600);

    return newFile;

  } catch (error) {

    // Rollback size increment if Mongo fails
    await redisClient.decrBy(redisSizeKey, fileSize);

    throw error;
  }
};


export const getRoomFileHistory = async (roomId) => {
  await validateRoomExists(roomId);

  const redisKey = `room:${roomId}:files`;

  const cachedFiles = await redisClient.lRange(redisKey, 0, -1);

  if (cachedFiles.length > 0) {
    return cachedFiles.map(file => JSON.parse(file));
  }

  const files = await File.find({ roomId })
    .sort({ createdAt: 1 })
    .lean();

  if (!files.length) {
    return [];
  }

  const pipeline = redisClient.multi();

  files.forEach((file) => {
    pipeline.rPush(redisKey, JSON.stringify(file));
  });

  pipeline.expire(redisKey, 3600);

  await pipeline.exec();

  return files;
};
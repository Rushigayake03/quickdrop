import { v4 as uuidv4 } from "uuid";
import Room from "../models/room.js";
import { redisClient } from "../config/redis.js";

export const createRoomService = async () => {
  const roomId = uuidv4();

  // Save to MongoDB
  await Room.create({ roomId });

  const roomKey = `room:${roomId}`;
  const usersKey = `room:${roomId}:users`;
  const sizeKey = `room:${roomId}:size`;

  const TTL = 60 * 60 * 24; // 24 hours

  const pipeline = redisClient.multi();

  // Store room metadata
  pipeline.hSet(roomKey, {
    roomId,
    createdAt: Date.now(),
  });

  pipeline.expire(roomKey, TTL);

  // Initialize total room size to 0
  pipeline.set(sizeKey, 0);
  pipeline.expire(sizeKey, TTL);

  // Ensure users set exists and has same TTL
  pipeline.sAdd(usersKey, "placeholder");
  pipeline.sRem(usersKey, "placeholder");
  pipeline.expire(usersKey, TTL);

  await pipeline.exec();

  return roomId;
};

export const roomExistsService = async (roomId) => {
  const exists = await redisClient.exists(`room:${roomId}`);
  return exists === 1;
};

export const addUserToRoomService = async (roomId, socketId) => {
  await redisClient.sAdd(`room:${roomId}:users`, socketId);

  const userCount = await redisClient.sCard(`room:${roomId}:users`);
  return userCount;
};

export const removeUserFromRoomService = async (roomId, socketId) => {
  await redisClient.sRem(`room:${roomId}:users`, socketId);

  const userCount = await redisClient.sCard(`room:${roomId}:users`);
  return userCount;
};

export const validateRoomExists = async (roomId) => {
  if (!roomId) {
    throw new Error("Room ID is required");
  }

  const exists = await redisClient.exists(`room:${roomId}`);

  if (!exists) {
    throw new Error("Room expired or does not exist");
  }

  return true;
};
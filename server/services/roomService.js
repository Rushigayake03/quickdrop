import { v4 as uuidv4 } from "uuid";
import Room from "../models/room.js";
import { redisClient } from "../config/redis.js";

export const createRoomService = async () => {
  const roomId = uuidv4();

  // Save to MongoDB
  await Room.create({ roomId });

  // Save to Redis Hash
  await redisClient.hSet(`room:${roomId}`, {
    roomId,
    createdAt: Date.now(),
  });

  // Set TTL 24 hours
  await redisClient.expire(`room:${roomId}`, 60 * 60 * 24);

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
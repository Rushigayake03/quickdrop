import { createRoomService } from "../services/roomService.js";

export const createRoom = async (req, res, next) => {
  try {
    const roomId = await createRoomService();

    res.status(201).json({
      success: true,
      roomId,
    });
  } catch (error) {
    next(error);
  }
};
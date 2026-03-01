import { createRoomService } from "../services/roomService.js";
import { getRoomSizeService } from "../services/roomService.js";

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

export const getRoomSize = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const sizeMB = await getRoomSizeService(roomId);

    res.json({
      success: true,
      sizeMB,
    });
  } catch (error) {
    next(error);
  }
};
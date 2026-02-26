import {
  uploadFileService,
  getRoomFilesService,
} from "../services/file.js";
import { getIO } from "../sockets/socket.js";

export const uploadFile = async (req, res, next) => {
  try {
    const { roomId } = req.body;

    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const file = await uploadFileService(
      roomId,
      req.file
    );

    //  Emit real-time event
    const io = getIO();
    console.log("Broadcasting to room:", roomId);
    io.to(roomId).emit("new-file", file);

    res.status(201).json({
      success: true,
      file,
    });
  } catch (error) {
    next(error);
  }
};

export const getRoomFiles = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const files = await getRoomFilesService(roomId);

    res.json({
      success: true,
      files,
    });
  } catch (error) {
    next(error);
  }
};
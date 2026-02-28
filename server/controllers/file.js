import {
  uploadFileService,
  getRoomFileHistory,
  getFileByIdService
} from "../services/file.js";

import { getIO } from "../sockets/socket.js";

export const uploadFile = async (req, res, next) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      throw new Error("Room ID is required");
    }

    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const file = await uploadFileService(roomId, req.file);

    const io = getIO();

    io.to(roomId).emit("new-file", file);

    res.status(201).json({
      success: true,
      file
    });

  } catch (error) {
    next(error);
  }
};


export const downloadFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;

    const { file, filePath } = await getFileByIdService(fileId);

    res.setHeader("Content-Type", file.mimeType);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`
    );

    res.sendFile(filePath);

  } catch (error) {
    next(error);
  }
};


export const getRoomFiles = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const files = await getRoomFileHistory(roomId);

    res.json({
      success: true,
      files
    });
  } catch (error) {
    next(error);
  }
};
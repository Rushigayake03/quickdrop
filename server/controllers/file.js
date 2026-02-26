import {
  uploadFileService,
  getRoomFilesService,
} from "../services/file.js";

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
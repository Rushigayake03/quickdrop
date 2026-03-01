import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadFile,
  getRoomFiles,
  deleteFile,
} from "../controllers/file.js";
import { downloadFile } from "../controllers/file.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/download/:fileId", downloadFile);
router.get("/:roomId", getRoomFiles);
router.delete("/:fileId", deleteFile);

export default router;

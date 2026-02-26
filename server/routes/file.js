import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadFile,
  getRoomFiles,
} from "../controllers/file.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/:roomId", getRoomFiles);

export default router;
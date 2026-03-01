import express from "express";
import { createRoom } from "../controllers/roomController.js";
import { getRoomSize } from "../controllers/roomController.js";
import { getRoomTTL } from "../controllers/roomController.js";

const router = express.Router();

router.post("/create", createRoom);
router.get("/:roomId/size", getRoomSize);
router.get("/:roomId/ttl", getRoomTTL);

export default router;

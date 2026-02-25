import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ===== Middleware =====
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ===== Health Route =====
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server running" });
});

// ===== Error Middleware =====
app.use(errorHandler);

// ===== Boot Function =====
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
  }
};

startServer();
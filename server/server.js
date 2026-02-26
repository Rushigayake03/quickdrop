import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

import connectDB from "./config/db.js";
import { connectRedis, redisClient } from "./config/redis.js";
import errorHandler from "./middleware/errorMiddleware.js";
import roomRoutes from "./routes/roomRoutes.js";
import fileRoutes from "./routes/file.js";
import { initSocket } from "./sockets/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ===== Middleware =====
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/rooms", roomRoutes);
app.use("/api/files", fileRoutes);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ===== Health Route =====
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server running" });
});

// ===== Socket.IO Setup =====
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ===== Redis Adapter Setup =====
const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

await pubClient.connect();
await subClient.connect();

io.adapter(createAdapter(pubClient, subClient));
initSocket(io);

// ===== Basic Socket Test =====
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", async (roomId) => {
    try {
      const exists = await redisClient.exists(`room:${roomId}`);

      if (!exists) {
        socket.emit("error", "Room does not exist");
        return;
      }

      socket.join(roomId);

      await redisClient.sAdd(`room:${roomId}:users`, socket.id);

      const userCount = await redisClient.sCard(
        `room:${roomId}:users`
      );

      io.to(roomId).emit("room-users", userCount);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("leave-room", async (roomId) => {
    await redisClient.sRem(`room:${roomId}:users`, socket.id);

    socket.leave(roomId);

    const userCount = await redisClient.sCard(
      `room:${roomId}:users`
    );

    io.to(roomId).emit("room-users", userCount);
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);
  });
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
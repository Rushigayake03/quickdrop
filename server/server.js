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
import { connectRedis } from "./config/redis.js";
import errorHandler from "./middleware/errorMiddleware.js";
import roomRoutes from "./routes/roomRoutes.js";
import fileRoutes from "./routes/file.js";
import { initSocket } from "./sockets/socket.js";
import setupSocketHandlers from "./sockets/socket.js";
import { startCleanupWorker } from "./workers/cleanupWorker.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

/*
=========================================
MIDDLEWARE
=========================================
*/
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);


app.use("/api/rooms", roomRoutes);
app.use("/api/files", fileRoutes);


app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server running",
  });
});


const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


const pubClient = createClient({
  url: process.env.REDIS_URL,
});

const subClient = pubClient.duplicate();

await pubClient.connect();
await subClient.connect();

io.adapter(createAdapter(pubClient, subClient));
initSocket(io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  setupSocketHandlers(socket);
});


app.use(errorHandler);


const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    startCleanupWorker();

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error.message);
  }
};

startServer();
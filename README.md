<div align="center">
  <h1>QuickDrop</h1>
  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React badge" />
    <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite badge" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS badge" />
    <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js badge" />
    <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express badge" />
    <img src="https://img.shields.io/badge/Socket.IO-Real_Time-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO badge" />
    <img src="https://img.shields.io/badge/Redis-Cache_&_Rooms-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis badge" />
    <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB badge" />
  </p>
  <img src="./client/public/quickdrop-logo-with-text.png" alt="QuickDrop logo" width="220" />
  <p><strong>Secure real-time file sharing with temporary rooms, live sync, and zero sign-up friction.</strong></p>
</div>

## Overview

QuickDrop is a full-stack file sharing app built for fast device-to-device transfers. A user can create a room instantly, share the room ID or link, and upload files that appear in real time for everyone inside that room.

The project combines a React frontend with an Express and Socket.IO backend, using Redis for room state and live coordination, MongoDB for persistence, and local disk storage for uploaded files.

## Why QuickDrop

- Instant room creation with no login flow
- Real-time file updates across connected devices
- Shareable room links and room IDs
- Live room user count and storage usage
- Automatic 24-hour room expiry
- Server-enforced 100 MB room storage limit
- Download and delete support for uploaded files
- Cleanup worker that removes expired room data and stored files

## Current Capabilities

### Frontend

- Landing page with one-click room creation
- Dedicated room view with drag-and-drop uploads
- Live room state via Socket.IO
- Copy room ID and copy room link actions
- Storage usage meter and expiry countdown
- Toast feedback for common actions and errors

### Backend

- REST APIs for room creation, room stats, uploads, downloads, and deletion
- Socket-based room join and leave handling
- Redis-backed room existence, user count, and cached file history
- MongoDB persistence for rooms and file metadata
- Periodic cleanup of expired rooms and local uploaded files
- Basic security middleware with `helmet`, `cors`, and rate limiting

## Supported File Types

The current upload filter accepts:

- `image/png`
- `image/jpeg`
- `application/pdf`
- `text/plain`

## How It Works

1. A user creates a room from the home page.
2. The backend generates a unique room ID and stores temporary room state in Redis with a 24-hour TTL.
3. Users join the room through its ID or URL.
4. Files are uploaded through the API and stored on disk, while metadata is saved in MongoDB.
5. Socket.IO broadcasts updates so every connected client sees new or deleted files immediately.
6. When a room expires, the cleanup worker removes its database records and physical files.

## Tech Stack

### Client

- React 19
- Vite
- React Router
- Zustand
- Axios
- React Dropzone
- Socket.IO Client
- Tailwind CSS

### Server

- Node.js
- Express
- Socket.IO
- Redis
- MongoDB with Mongoose
- Multer
- Helmet
- Morgan
- Express Rate Limit

## Project Structure

```text
quickdrop/
|-- client/                  # React + Vite frontend
|   |-- public/              # Static assets
|   `-- src/
|       |-- components/      # UI and room components
|       |-- hooks/           # Socket logic
|       |-- pages/           # Home and Room pages
|       |-- services/        # API helpers
|       `-- store/           # Zustand room state
|-- server/                  # Express + Socket.IO backend
|   |-- config/              # MongoDB and Redis connection setup
|   |-- constants/           # App limits
|   |-- controllers/         # Route handlers
|   |-- middleware/          # Upload and error middleware
|   |-- models/              # Mongoose models
|   |-- routes/              # API routes
|   |-- services/            # Business logic
|   |-- sockets/             # Socket event handlers
|   `-- workers/             # Expired room cleanup worker
`-- README.md
```

## Local Development

### Prerequisites

Make sure you have these installed and running:

- Node.js 18 or later
- MongoDB
- Redis

### 1. Clone the repository

```bash
git clone https://github.com/Rushigayake03/quickdrop.git
cd quickdrop
```

### 2. Install dependencies

```bash
cd server
npm install
```

```bash
cd ../client
npm install
```

### 3. Configure environment variables

Create `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/quickdrop
REDIS_URL=redis://127.0.0.1:6379
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

The repository already includes `client/.env.production` for a deployed API URL.

### 4. Start the backend

```bash
cd server
npm run dev
```

### 5. Start the frontend

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## Available Scripts

### Client

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint

### Server

- `npm run dev` starts the backend with Nodemon
- `npm start` starts the backend with Node.js

## API Overview

### Room Routes

- `POST /api/rooms/create` creates a new room
- `GET /api/rooms/:roomId/size` returns current room storage usage in MB
- `GET /api/rooms/:roomId/ttl` returns remaining room lifetime in seconds

### File Routes

- `POST /api/files/upload` uploads a file to a room
- `GET /api/files/:roomId` fetches room file history
- `GET /api/files/download/:fileId` downloads a file
- `DELETE /api/files/:fileId` deletes a file

### Health Route

- `GET /api/health` confirms the server is running

## Real-Time Events

The Socket.IO layer powers the live room experience with events such as:

- `join-room`
- `leave-room`
- `room-users`
- `room-history`
- `new-file`
- `file-deleted`

## Storage and Expiry Rules

- Each room is limited to `100 MB` total storage
- Rooms expire after `24 hours`
- A warning is shown in the UI when less than `10 minutes` remain
- The cleanup worker runs every `10 minutes`
- Uploaded files are stored on local disk inside the server upload directory

## Security and Reliability Notes

- CORS is restricted through `CLIENT_URL`
- Rate limiting is set to `100` requests per `15 minutes`
- `helmet` is enabled for common HTTP security headers
- Redis is used for fast room validation, TTL tracking, and live user counts
- MongoDB stores durable room and file metadata

## Deployment Notes

For production deployment, make sure:

- the client points to the deployed backend through `VITE_API_URL`
- the backend `CLIENT_URL` matches the deployed frontend origin
- MongoDB and Redis are both reachable from the deployed server
- persistent disk or object storage is considered if you want uploads to survive server replacement

## Roadmap Ideas

- Room join page for entering an existing room ID
- Broader file type support
- Upload progress indicators
- Direct share targets or QR-based room joining
- Cloud object storage for better production durability

## Summary

QuickDrop is designed to make temporary file sharing feel immediate, clean, and dependable. If you want a modern starter project for real-time file transfer with React, Express, Redis, MongoDB, and Socket.IO, this codebase provides a solid foundation.

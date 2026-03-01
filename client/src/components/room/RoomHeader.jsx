import { useEffect, useRef, useState } from "react";
import { useRoomStore } from "../../store/roomStore";
import { useToast } from "../ui/Toast/ToastProvider";
import { getRoomTTL } from "../../services/roomService";

const ROOM_LIMIT_MB = 100;

export default function RoomHeader({ roomId }) {
  const { userCount, storageMB } = useRoomStore();
  const { addToast } = useToast();
  const [ttlSeconds, setTtlSeconds] = useState(null);
  const warningShownRef = useRef(false);

  const percentage = Math.min(
    (storageMB / ROOM_LIMIT_MB) * 100,
    100
  );
  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomId);
    addToast("success", "Room ID copied");
  };
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    addToast("success", "Room link copied");
  };

  useEffect(() => {
    if (!roomId) return;

    let intervalId;
    warningShownRef.current = false;

    const loadTTL = async () => {
      const data = await getRoomTTL(roomId);
      const initialTTL = Math.max(data.ttl, 0);
      setTtlSeconds(initialTTL);

      intervalId = setInterval(() => {
        setTtlSeconds((prev) => {
          if (prev === null) return prev;
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);
    };

    loadTTL();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [roomId]);

  useEffect(() => {
    if (ttlSeconds === null) return;
    if (ttlSeconds < 600 && !warningShownRef.current) {
      warningShownRef.current = true;
      addToast("warning", "Room expires in less than 10 minutes");
    }
  }, [ttlSeconds, addToast]);

  const formatTTL = (seconds) => {
    if (seconds === null) return "--:--:--";
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-secondary-200 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-primary-900">Room</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-secondary-400 break-all">
              {roomId}
            </p>
            <button
              onClick={handleCopy}
              className="text-xs bg-secondary-200 text-primary-900 px-2 py-1 rounded hover:bg-secondary-300 transition"
            >
              Copy
            </button>
            <button
              onClick={handleCopyLink}
              className="bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700 transition"
            >
              Copy Link
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Users</p>
          <p className="text-lg font-semibold text-primary-700">{userCount}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Room expires in:</span>
          <span>{formatTTL(ttlSeconds)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>Storage Usage</span>
          <span>
            {storageMB} MB / {ROOM_LIMIT_MB} MB
          </span>
        </div>

        <div className="w-full bg-secondary-200 rounded h-3">
          <div
            className="h-3 bg-primary-600 rounded transition-all duration-500 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

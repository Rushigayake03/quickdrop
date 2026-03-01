import { useRoomStore } from "../../store/roomStore";
import { useToast } from "../ui/Toast/ToastProvider";

const ROOM_LIMIT_MB = 100;

export default function RoomHeader({ roomId }) {
  const { userCount, storageMB } = useRoomStore();
  const { addToast } = useToast();

  const percentage = Math.min(
    (storageMB / ROOM_LIMIT_MB) * 100,
    100
  );
  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomId);
    addToast("success", "Room ID copied");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-secondary-200 space-y-4">
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
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Users</p>
          <p className="text-lg font-semibold text-primary-700">{userCount}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Storage Usage</span>
          <span>
            {storageMB} MB / {ROOM_LIMIT_MB} MB
          </span>
        </div>

        <div className="w-full bg-secondary-200 rounded h-3">
          <div
            className="h-3 bg-primary-600 rounded transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

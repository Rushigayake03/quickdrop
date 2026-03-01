import { useRoomStore } from "../../store/roomStore";

const ROOM_LIMIT_MB = 100;

export default function RoomHeader({ roomId }) {
  const { userCount, storageMB } = useRoomStore();

  const percentage = Math.min(
    (storageMB / ROOM_LIMIT_MB) * 100,
    100
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Room</h1>
          <p className="text-sm text-gray-500 break-all">
            {roomId}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Users</p>
          <p className="text-lg font-semibold">{userCount}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Storage Usage</span>
          <span>
            {storageMB} MB / {ROOM_LIMIT_MB} MB
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded h-3">
          <div
            className="h-3 bg-blue-600 rounded transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
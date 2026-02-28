import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useRoomStore } from "../store/roomStore";
import { useSocket } from "../hooks/useSocket";
import FileDropzone from "../components/room/FileDropzone";

export default function Room() {
  const { roomId } = useParams();
  const { setRoomId, userCount } = useRoomStore();

  useEffect(() => {
    setRoomId(roomId);
  }, [roomId]);

  useSocket(roomId);

  return (
    <div className="min-h-screen p-8 space-y-6">
      <h1 className="text-2xl font-bold">Room: {roomId}</h1>
      <p>Users in room: {userCount}</p>
      <FileDropzone />
    </div>
  );
}
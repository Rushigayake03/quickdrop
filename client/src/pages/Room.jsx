import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useRoomStore } from "../store/roomStore";
import { useSocket } from "../hooks/useSocket";
import FileDropzone from "../components/room/FileDropzone";
import RoomHeader from "../components/room/RoomHeader";
import FileList from "../components/room/FileList";
import { getRoomSize } from "../services/roomService";



export default function Room() {
  const { roomId } = useParams();
  const { setRoomId, userCount, setStorage } = useRoomStore();

  useEffect(() => {
    setRoomId(roomId);
  }, [roomId]);
  useEffect(() => {
  const fetchSize = async () => {
    try {
      const res = await getRoomSize(roomId);
      setStorage(res.sizeMB);
    } catch (error) {
      console.error("Failed to fetch storage size");
    }
  };

  if (roomId) {
    fetchSize();
  }
}, [roomId]);

  useSocket(roomId);

  return (
  <div className="min-h-screen px-8 py-10 bg-secondary-100 space-y-8 max-w-4xl mx-auto">
    <RoomHeader roomId={roomId} />
    <FileDropzone />
    <FileList />
  </div>
  );
}

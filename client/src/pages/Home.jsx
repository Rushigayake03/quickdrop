import { useNavigate } from "react-router-dom";
import { createRoom } from "../services/roomService";
import { useToast } from "../components/ui/Toast/ToastProvider";

export default function Home() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleCreateRoom = async () => {
    try {
      const res = await createRoom();
      navigate(`/room/${res.roomId}`);
      addToast("success", "Room created successfully");
    } catch (error) {
      addToast("error", error.response?.data?.message || "Failed to create room");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleCreateRoom}
        className="px-6 py-3 bg-blue-600 text-white rounded"
      >
        Create Room
      </button>
    </div>
  );
}
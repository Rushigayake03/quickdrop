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
    <div className="bg-secondary-100 min-h-screen">
      <section className="max-w-6xl mx-auto px-8 py-20 flex items-center justify-between gap-12">
        <div className="max-w-xl space-y-6">
          <h1 className="text-5xl font-bold text-primary-900">
            Secure Real-Time File Sharing
          </h1>

          <p className="text-primary-700 text-lg">
            Instantly create rooms and share files with multiple devices.
            No login. No friction. Just seamless sharing.
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleCreateRoom}
              className="bg-primary-600 text-white px-6 py-3 rounded hover:bg-primary-700 transition"
            >
              Create Room
            </button>

            <a
              href="https://github.com/Rushigayake03/quickdrop"
              className="border border-primary-600 text-primary-600 px-4 py-3 rounded hover:bg-primary-600 hover:text-white transition flex items-center gap-2"
            >
              <img src="/github.svg" alt="GitHub" className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div>
          <div className="overflow-hidden rounded-lg shadow-2xl">
            <img
              src="/hero image.png"
              alt="Illustration"
              className="w-[1000px] transform transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-primary-900 font-semibold mb-2">
            Real-Time Sync
          </h3>
          <p className="text-secondary-400">
            Files instantly appear across all devices.
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-primary-900 font-semibold mb-2">
            100MB Room Storage
          </h3>
          <p className="text-secondary-400">
            Automatic storage tracking and limit enforcement.
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-primary-900 font-semibold mb-2">
            Auto Expiring Rooms
          </h3>
          <p className="text-secondary-400">
            Rooms expire automatically after 24 hours.
          </p>
        </div>
      </section>
    </div>
  );
}

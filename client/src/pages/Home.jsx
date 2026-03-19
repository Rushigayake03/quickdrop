import { useNavigate } from "react-router-dom";
import { createRoom } from "../services/roomService";
import { useToast } from "../components/ui/Toast/ToastProvider";
import FeatureCard from "../components/ui/FeatureCard";

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
          <img
            src="/quickdrop-without-text.png"
            alt="QuickDrop logo"
            className="h-16 w-16 object-contain"
          />

          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight text-primary-900">
            Secure Real-Time File Sharing
          </h1>

          <p className="text-primary-700 text-lg md:text-xl leading-relaxed font-medium">
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
              target="_blank"
              rel="noopener noreferrer"
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
              className="w-full max-w-[500px] transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-24">
        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard
            title="Real-Time Sync"
            description="Files instantly appear across all devices."
            icon="/real-time-icon.svg"
          />

          <FeatureCard
            title="100MB Room Storage"
            description="Automatic storage tracking and limit enforcement."
            icon="/database-icon.svg"
          />

          <FeatureCard
            title="Auto Expiring Rooms"
            description="Rooms expire automatically after 24 hours."
            icon="/sand-clock-full-icon.svg"
          />
        </div>
      </section>
    </div>
  );
}

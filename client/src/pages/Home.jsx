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
      <section className="mx-auto flex max-w-6xl flex-col items-start gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-20">
        <div className="w-full max-w-xl space-y-5 sm:space-y-6">
          <img
            src="/quickdrop-without-text.png"
            alt="QuickDrop logo"
            className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:h-16 lg:w-16"
          />

          <h1 className="max-w-[12ch] text-4xl font-black leading-[0.95] tracking-tight text-primary-900 sm:max-w-[13ch] sm:text-5xl sm:leading-none lg:max-w-none lg:text-6xl lg:leading-tight">
            Secure Real-Time File Sharing
          </h1>

          <p className="max-w-lg text-base font-medium leading-7 text-primary-700 sm:text-lg md:text-xl">
            Instantly create rooms and share files with multiple devices.
            No login. No friction. Just seamless sharing.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <button
              onClick={handleCreateRoom}
              className="min-h-12 rounded-md bg-primary-600 px-6 py-3 text-center text-white transition hover:bg-primary-700 sm:min-w-[160px]"
            >
              Create Room
            </button>

            <a
              href="https://github.com/Rushigayake03/quickdrop"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary-600 px-4 py-3 text-primary-600 transition hover:bg-primary-600 hover:text-white sm:min-w-[160px]"
            >
              <img src="/github.svg" alt="GitHub" className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="flex w-full justify-center lg:w-auto lg:justify-end">
          <div className="w-full max-w-[420px] overflow-hidden rounded-2xl shadow-2xl sm:max-w-[480px] lg:max-w-[500px]">
            <img
              src="/hero image.png"
              alt="Illustration"
              className="w-full transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:py-24">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
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

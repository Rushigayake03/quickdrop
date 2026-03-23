import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="flex items-center justify-between border-b border-primary-700 bg-primary-900 px-4 py-3 text-white sm:px-6 sm:py-4 lg:px-10"
    >
      <div
        onClick={() => navigate("/")}
        className="flex cursor-pointer items-center gap-2 text-base font-semibold tracking-wide sm:gap-3 sm:text-xl"
      >
        <img
          src="/quickdrop-without-text.png"
          alt="QuickDrop logo"
          className="h-8 w-8 object-contain sm:h-9 sm:w-9"
        />
        <span className="whitespace-nowrap">QuickDrop</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
        <button
          onClick={() => navigate("/")}
          className="text-xs opacity-80 transition hover:opacity-100 sm:text-sm"
        >
          Home
        </button>

        <a
          href="https://github.com/your-username/your-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-xs transition hover:bg-primary-700 sm:px-4 sm:text-sm"
        >
          <FaGithub />
          GitHub
        </a>
      </div>
    </nav>
  );
}

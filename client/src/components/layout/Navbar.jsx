import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="
      bg-primary-900
      text-white
      px-10
      py-4
      flex
      justify-between
      items-center
      border-b
      border-primary-700
    "
    >
      <div
        onClick={() => navigate("/")}
        className="text-xl font-semibold cursor-pointer tracking-wide"
      >
        QuickDrop
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/")}
          className="text-sm opacity-80 hover:opacity-100 transition"
        >
          Home
        </button>

        <a
          href="https://github.com/your-username/your-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center gap-2
            bg-primary-600
            px-4 py-2
            rounded-md
            hover:bg-primary-700
            transition
            text-sm
          "
        >
          <FaGithub />
          GitHub
        </a>
      </div>
    </nav>
  );
}

import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-primary-900 text-white px-8 py-4 flex justify-between items-center shadow">
      <div
        onClick={() => navigate("/")}
        className="font-semibold text-lg cursor-pointer"
      >
        QuickDrop
      </div>

      <div className="text-sm opacity-80">
        Real-Time File Sharing
      </div>
    </nav>
  );
}
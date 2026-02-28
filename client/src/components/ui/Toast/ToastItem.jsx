const typeStyles = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  warning: "bg-yellow-500",
};

const ToastItem = ({ toast }) => {
  return (
    <div
      className={`px-4 py-3 text-white rounded shadow transition transform duration-300 ${typeStyles[toast.type]}`}
    >
      {toast.message}
    </div>
  );
};

export default ToastItem;
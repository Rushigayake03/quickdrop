const typeStyles = {
  success: "bg-primary-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-secondary-500 text-white",
  warning: "bg-yellow-500 text-black",
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

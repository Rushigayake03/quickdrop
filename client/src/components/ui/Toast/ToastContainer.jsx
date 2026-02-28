import ToastItem from "./ToastItem";

const ToastContainer = ({ toasts }) => {
  return (
    <div className="fixed top-4 right-4 space-y-3 z-50">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
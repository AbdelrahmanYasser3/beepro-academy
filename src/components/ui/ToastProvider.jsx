import { useEffect, useState } from "react";
import { TOAST_EVENT } from "../../lib/toast";

const ToastProvider = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const onToast = (event) => {
      setToast(event.detail);
      window.setTimeout(() => setToast(null), 2800);
    };

    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  if (!toast) return null;

  const tone =
    toast.type === "error"
      ? "bg-red-600 text-white"
      : toast.type === "warning"
        ? "bg-yellow-600 text-white"
        : "bg-green-600 text-white";

  return (
    <div className="fixed bottom-4 right-4 z-[2000]">
      <div className={`rounded-lg px-4 py-3 shadow-lg ${tone}`}>
        {toast.message}
      </div>
    </div>
  );
};

export default ToastProvider;

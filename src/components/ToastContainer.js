import React from "react";
import { useToast } from "../contexts/ToastContext";

function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className="toast" role="status">
          {t.icon && (
            <span className="toast-icon" aria-hidden="true">
              {t.icon}
            </span>
          )}
          <span className="toast-text">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;

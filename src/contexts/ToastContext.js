import React, { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext({ showToast: () => {} });

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, { icon, duration = 2600 } = {}) => {
      const id = ++nextId;
      setToasts((current) => [...current, { id, message, icon }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast, toasts, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

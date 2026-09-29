import { createContext, useCallback, useContext, useMemo, useState } from "react";

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

  // Memoised for the same reason as the theme value: the object changes only
  // when a toast comes or goes.
  const value = useMemo(() => ({ showToast, toasts, dismiss }), [showToast, toasts, dismiss]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export const useToast = () => useContext(ToastContext);

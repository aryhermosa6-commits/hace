import { createContext, useContext, useState } from 'react';

/**
 * Toast context provider. Provides a simple API: toast.show(message, duration)
 * and renders toasts at the bottom of the screen.
 */
const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = (msg, dur = 3000) => {
    const id = Date.now();
    setToasts((ts) => [...ts, { id, msg }]);
    setTimeout(() => {
      setToasts((ts) => ts.filter((t) => t.id !== id));
    }, dur);
  };

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="toastContainer">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx) || { show: () => {} };
}
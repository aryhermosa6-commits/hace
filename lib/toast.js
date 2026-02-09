import { createContext, useContext, useEffect, useState } from 'react';

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

  // Global event bridge so code can do: toast('msg') without using the hook.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e) => {
      const d = e?.detail || {};
      const msg = String(d.message ?? d.msg ?? '');
      if (!msg) return;
      const dur = Number.isFinite(d.duration) ? d.duration : 3000;
      show(msg, dur);
    };
    window.addEventListener('hc-toast', handler);
    return () => window.removeEventListener('hc-toast', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

// Simple client helper. Safe to import anywhere; does nothing on server.
export function toast(message, duration = 3000) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('hc-toast', { detail: { message, duration } }));
  } catch {
    // ignore
  }
}

export function useToast() {
  return useContext(ToastCtx) || { show: () => {} };
}
import { useRef, useState, useContext, createContext, useCallback } from "react";
import ReactDOM from "react-dom";
import './Toast.css'
import { SquareCheckBig, Ban } from 'lucide-react'
const ToastContext = createContext()

export function ToastProvider({ children }) {
  const toastRef = useRef();
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message,type='ok', duration = 3000 ) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, type, message, }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);

    return id
  }, []);



  const contextValue = {
    addToast,
    toastRef,
    toasts
  };

  return (
    <>
      <ToastContext.Provider value={contextValue}>
        {children}
      </ToastContext.Provider>
      <div id="toast-ref" ref={toastRef} />
    </>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}



export function Toast() {
  const { toastRef, toasts } = useContext(ToastContext)



  if (!toastRef || !toastRef.current) return null

  if(!toasts.length) return null

  return ReactDOM.createPortal(
    <div id="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <div className="toast-message">
           {toast.type === 'ok' ? <SquareCheckBig /> : <Ban/> }
            {toast.message}
          </div>
        </div>
      ))}
    </div>,
    toastRef.current
  );
}

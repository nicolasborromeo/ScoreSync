// import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import { Modal, ModalProvider } from './context/Modal'
import { ToastProvider, Toast } from './context/ToastContext';

const store = configureStore();

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ModalProvider>
    <ToastProvider>
      <Provider store={store}>
        <App />
        <Modal />
        <Toast />
      </Provider>
    </ToastProvider>
  </ModalProvider>
  // </React.StrictMode>
);

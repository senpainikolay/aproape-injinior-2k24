import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify'; 
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import './i18n';




const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
    <AuthProvider>
    <App />
    </AuthProvider>
    <ToastContainer />
    </BrowserRouter>
);

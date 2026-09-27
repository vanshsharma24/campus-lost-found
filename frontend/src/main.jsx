import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#ffffff',
                        color: '#0f172a',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: 500
                    },
                    success: {
                        iconTheme: { primary: '#10b981', secondary: '#ffffff' }
                    },
                    error: {
                        iconTheme: { primary: '#ef4444', secondary: '#ffffff' }
                    }
                }}
            />
            <App />
        </AuthProvider>
    </BrowserRouter>
);

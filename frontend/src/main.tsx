import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { router } from './router';
import { LanguageProvider } from './context/LanguageContext';
import './app/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <LanguageProvider>
                <RouterProvider router={router} />
            </LanguageProvider>
        </ThemeProvider>
    </React.StrictMode>
);

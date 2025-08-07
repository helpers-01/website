import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'; // explicitly include extension if you're using TS and want to avoid ambiguity
import { AuthProvider } from './context/AuthProvider.tsx'; // same here
import './index.css'; // styles

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure <div id="root"></div> exists in index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
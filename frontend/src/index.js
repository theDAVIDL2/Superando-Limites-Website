import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Register Service Worker for caching and offline support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));

// Remove StrictMode in production for better performance
// StrictMode causes double-rendering in development which is helpful for debugging
// but adds overhead in production
root.render(
  process.env.NODE_ENV === 'development' ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  )
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// Wait for Office to be ready
Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    // Render the React app
    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});
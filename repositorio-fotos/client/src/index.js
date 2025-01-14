import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // <--- Importa App con la ruta correcta

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

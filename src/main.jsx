import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Asegúrate de que esta ruta sea correcta
import '../src/styles/index.css'; // si tienes estilos globales

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


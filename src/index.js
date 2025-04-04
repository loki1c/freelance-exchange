import React from 'react';
import ReactDOM from 'react-dom/client'; // Используем правильный импорт
import App from './App';
import './index.css'; // Подключение стилей

const root = ReactDOM.createRoot(document.getElementById('root')); // Создание root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

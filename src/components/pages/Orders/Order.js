import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ChatWindow from "../Chat/ChatWindow"; // путь к ChatWindow
import "./Orders.css";

const Order = () => {
  const { id } = useParams();  // Получаем ID из параметров URL
  const [order, setOrder] = useState(null);  // Состояние для хранения данных заказа
  const [error, setError] = useState("");  // Состояние для ошибок
  const [showChat, setShowChat] = useState(false);  // Состояние для отображения чата

  const token = localStorage.getItem("token");  // Получаем токен из localStorage для аутентификации

  // Функция для получения данных о заказе
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/user/profile/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);  // Сохраняем данные заказа
      } catch (err) {
        console.error("Ошибка при получении заказа:", err);
        setError("Не удалось загрузить заказ.");
      }
    };

    fetchOrder();
  }, [id, token]);

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!order) return <div className="loading">Загрузка...</div>;

  return (
    <div className="create-order-page">
      <div className="container py-5">
        <h2 className="section-title">{order.title}</h2>
        <div className="order-detail-card">
          <div className="order-info">
            <p className="order-description">{order.description}</p>
            <p className="order-price">
              <strong>Цена:</strong> {order.price} тг
            </p>
            <p className="order-category">
              <strong>Категория:</strong> {order.category || "Не указана"}
            </p>
            <p className="order-deadline">
              <strong>Срок выполнения:</strong> {order.deadline ? formatDate(order.deadline) : "Не указан"}
            </p>
            {order.file && (
              <p className="order-file">
                <strong>Файл:</strong>{" "}
                <div>
                  {/* Кнопка "Открыть файл" */}
                  <a
                    href={`http://localhost:8000/storage/${order.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginRight: '10px' }}
                  >
                    Скачать файл
                  </a>
                </div>
              </p>
            )}
            <p className="order-status">
              <strong>Статус:</strong>{" "}
              <span className={`status-${order.status?.toLowerCase()}`}>
                {order.status || "Не указан"}
              </span>
            </p>
            <p className="order-date">
              <strong>Создан:</strong> {formatDate(order.createdAt)}
            </p>
            <p className="order-author">
              <strong>Автор:</strong> {order.user?.name || "Неизвестно"}
            </p>
            <p className="order-email">
              <strong>Email автора:</strong> {order.user?.email || "Не указан"}
            </p>
          </div>

          {/* Кнопка "Написать" для открытия чата */}
          <button
            className="btn btn-primary mt-3"
            onClick={() => setShowChat(true)}
          >
            Написать
          </button>
        </div>

        {/* Чат появляется при нажатии */}
        {showChat && (
          <ChatWindow orderId={id} onClose={() => setShowChat(false)} />
        )}
      </div>
    </div>
  );
};

export default Order;

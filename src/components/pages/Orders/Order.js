import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ChatWindow from "../Chat/ChatWindow";
import "./Orders.css";

const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [viewCount, setViewCount] = useState(0);
  const [error, setError] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderRes = await axios.get(`/api/user/profile/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(orderRes.data);

        const viewCountRes = await axios.get(`/api/user/profile/orders/${id}/view-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setViewCount(viewCountRes.data.view_count);
      } catch (err) {
        console.error("Ошибка при получении данных:", err);
        setError("Не удалось загрузить данные.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        `/api/user/profile/orders/${id}/add-to-cart`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
      alert("Произошла ошибка при добавлении в корзину.");
    }
  };

  const handleAcceptOrder = async () => {
    try {
      const response = await axios.post(
        `/api/user/profile/orders/${id}/send-request`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Ошибка при принятии заказа:", error);
      alert("Произошла ошибка при отклике на заказ.");
    }
  };
  

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

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!order) return <div className="order-not-found">Заказ не найден.</div>;

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
            <p className="order-view-count">
              <strong>Количество просмотров:</strong> {viewCount}
            </p>
          </div>

          <div className="order-buttons">
            {/* Кнопка "Добавить в корзину" */}
            <button
              className="btn btn-success mt-3 me-2"
              onClick={handleAddToCart}
            >
              Добавить в корзину
            </button>

            {/* Кнопка "Написать" */}
            <button
              className="btn btn-primary mt-3 me-2"
              onClick={() => setShowChat(true)}
            >
              Написать
            </button>

            {/* Кнопка "Принять заказ" */}
            <button
              className="btn btn-warning mt-3"
              onClick={handleAcceptOrder}
            >
              Принять заказ
            </button>
          </div>

          {/* Чат появляется при нажатии */}
          {showChat && (
            <ChatWindow orderId={id} onClose={() => setShowChat(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;

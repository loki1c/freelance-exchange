import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ChatWindow from "../Chat/ChatWindow"; // путь к ChatWindow
import "./Orders.css";

const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [showChat, setShowChat] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
      } catch (err) {
        console.error("Ошибка при получении заказа:", err);
        setError("Не удалось загрузить заказ.");
      }
    };

    fetchOrder();
  }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!order) return <div>Загрузка...</div>;

  return (
    <div className="container py-5">
      <div className="order-detail-card">
        <h2>{order.title}</h2>
        <p>{order.description}</p>
        <p><strong>Цена:</strong> {order.price} тг</p>
        <p><strong>Автор:</strong> {order.user?.name || "Неизвестно"}</p>

        {/* Кнопка "Написать" */}
        <button className="btn btn-primary mt-3" onClick={() => setShowChat(true)}>
          Написать
        </button>
      </div>

      {/* Чат появляется при нажатии */}
      {showChat && (
        <ChatWindow orderId={id} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default Order;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/user/profile/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке заказов:", error);
      setMessage("Не удалось загрузить заказы.");
    }
  };

  const handleDeleteOrder = async (order) => {
    setMessage("");
    try {
      await axios.delete(`/api/user/profile/orders/${order.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(orders.filter((o) => o.id !== order.id));
      setMessage("Заказ успешно удален.");
    } catch (error) {
      console.error("Ошибка при удалении заказа:", error);
      setMessage("Ошибка при удалении заказа.");
    }
  };

  return (
    <div className="profile-page">
      <div className="container py-5">
        <h2 className="section-title">Мой профиль</h2>

        <div className="d-flex justify-content-end mb-4">
          <a
            href="/profile/orders"
            className="btn btn-success custom-btn"
          >
            Создать заказ
          </a>
        </div>

        <h3 className="section-title">Мои заказы</h3>
        {message && <p className="alert alert-info">{message}</p>}
        {orders.length === 0 ? (
          <p className="no-orders">У вас пока нет заказов.</p>
        ) : (
          <div className="row g-4">
            {orders.map((order) => (
              <div className="col-md-4" key={order.id}>
                <div className="order-card">
                  <img
                    src={order.image}
                    alt={order.title}
                    className="order-image"
                  />
                  <div className="order-info">
                    <h5 className="order-title">{order.title}</h5>
                    <p className="order-description">{order.description}</p>
                    <p className="order-price">{order.price}</p>
                    <div className="order-actions">
                      <button
                        className="btn btn-primary custom-btn me-2"
                        onClick={() => navigate(`/profile/orders/${order.id}`)}
                      >
                        Подробнее
                      </button>
                      <button
                        className="btn btn-danger custom-btn"
                        onClick={() => handleDeleteOrder(order)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

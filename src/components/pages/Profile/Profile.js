import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ title: "", description: "", price: "" });
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://your-backend-api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Ошибка при загрузке заказов:", error);
      // Заглушка, если API недоступен
      setOrders([
        {
          id: 1,
          title: "Разработка сайта",
          description: "Создание сайта для бизнеса.",
          price: "120 000 тг",
          image: "URL_ДЛЯ_КАРТИНКИ_ЗАКАЗА_1", // Замени на реальный URL
        },
        {
          id: 2,
          title: "Копирайтинг",
          description: "Написание текстов для рекламы.",
          price: "60 000 тг",
          image: "URL_ДЛЯ_КАРТИНКИ_ЗАКАЗА_2", // Замени на реальный URL
        },
      ]);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://your-backend-api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newOrder),
      });
      const data = await response.json();
      setOrders([...orders, data]);
      setNewOrder({ title: "", description: "", price: "" });
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewOrder({ title: order.title, description: order.description, price: order.price });
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://your-backend-api/orders/${editingOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newOrder),
      });
      const updatedOrder = await response.json();
      setOrders(orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
      setEditingOrder(null);
      setNewOrder({ title: "", description: "", price: "" });
    } catch (error) {
      console.error("Ошибка при обновлении заказа:", error);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await fetch(`http://your-backend-api/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(orders.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении заказа:", error);
    }
  };

  return (
    <div className="profile-page">
      <div className="container py-5">
        <h2 className="section-title">Мой профиль</h2>
        <div className="card mb-4 profile-form-card">
          <div className="card-body">
            <h5 className="form-title">{editingOrder ? "Редактировать заказ" : "Создать новый заказ"}</h5>
            <form onSubmit={editingOrder ? handleUpdateOrder : handleCreateOrder}>
              <div className="mb-3">
                <label className="form-label">Название</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  value={newOrder.title}
                  onChange={(e) => setNewOrder({ ...newOrder, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Описание</label>
                <textarea
                  className="form-control custom-input"
                  value={newOrder.description}
                  onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Цена</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  value={newOrder.price}
                  onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary custom-btn">
                {editingOrder ? "Обновить" : "Создать"}
              </button>
              {editingOrder && (
                <button
                  type="button"
                  className="btn btn-secondary custom-btn ms-2"
                  onClick={() => {
                    setEditingOrder(null);
                    setNewOrder({ title: "", description: "", price: "" });
                  }}
                >
                  Отмена
                </button>
              )}
            </form>
          </div>
        </div>

        <h3 className="section-title">Мои заказы</h3>
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
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        Подробнее
                      </button>
                      <button
                        className="btn btn-warning custom-btn me-2"
                        onClick={() => handleEditOrder(order)}
                      >
                        Редактировать
                      </button>
                      <button
                        className="btn btn-danger custom-btn"
                        onClick={() => handleDeleteOrder(order.id)}
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
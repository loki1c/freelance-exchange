import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ title: "", description: "", price: "" });
  const [editingOrder, setEditingOrder] = useState(null);
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

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setMessage(""); // Очистка предыдущих сообщений
    try {
      const response = await axios.post("/api/user/profile/orders", newOrder, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders([...orders, response.data]);
      setNewOrder({ title: "", description: "", price: "" });
      setMessage("Заказ успешно создан.");
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      setMessage("Ошибка при создании заказа.");
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewOrder({ title: order.title, description: order.description, price: order.price });
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    setMessage(""); // Очистка предыдущих сообщений
    try {
      const response = await axios.put(
        `/api/user/profile/orders/${editingOrder.id}`,
        newOrder,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrders(orders.map((order) => (order.id === response.data.id ? response.data : order)));
      setEditingOrder(null);
      setNewOrder({ title: "", description: "", price: "" });
      setMessage("Заказ успешно обновлен.");
    } catch (error) {
      console.error("Ошибка при обновлении заказа:", error);
      setMessage("Ошибка при обновлении заказа.");
    }
  };

  const handleDeleteOrder = async (id) => {
    setMessage(""); // Очистка предыдущих сообщений
    try {
      await axios.delete(`/api/user/profile/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(orders.filter((order) => order.id !== id));
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

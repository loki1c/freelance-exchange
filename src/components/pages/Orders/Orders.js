import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Orders.css";

const Orders = () => {
  const [order, setOrder] = useState({ title: "", description: "", price: "" });
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/user/profile/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке заказов:", err);
    }
  };

  useEffect(() => {
    const savedOrder = localStorage.getItem("editOrder");
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);
      setOrder(parsedOrder);
      setIsEditing(true);
      setEditOrderId(parsedOrder.id);
      localStorage.removeItem("editOrder"); // очищаем после загрузки
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (isEditing) {
        await axios.put(`/api/user/profile/orders/${editOrderId}`, order, config);
        setMessage("Заказ успешно обновлён!");
      } else {
        await axios.post("/api/user/profile/orders", order, config);
        setMessage("Заказ успешно создан!");
      }

      setOrder({ title: "", description: "", price: "" });
      setIsEditing(false);
      setEditOrderId(null);
      fetchOrders();
    } catch (err) {
      console.error("Ошибка при отправке:", err);
      setMessage("Произошла ошибка при сохранении заказа.");
    }
  };

  return (
    <div className="create-order-page">
      <div className="container py-5">
        <h2 className="section-title">{isEditing ? "Редактировать заказ" : "Выставить заказ"}</h2>
        <div className="create-order-card">
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Название</label>
              <input
                type="text"
                className="form-control"
                value={order.title}
                onChange={(e) => setOrder({ ...order, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Описание</label>
              <textarea
                className="form-control"
                value={order.description}
                onChange={(e) => setOrder({ ...order, description: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Цена</label>
              <input
                type="text"
                className="form-control"
                value={order.price}
                onChange={(e) => setOrder({ ...order, price: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Сохранить изменения" : "Создать заказ"}
            </button>
          </form>
        </div>
        {orders.length === 0 && <p>У вас пока нет заказов.</p>}
      </div>
    </div>
  );
};

export default Orders;

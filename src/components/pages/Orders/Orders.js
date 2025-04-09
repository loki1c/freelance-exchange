import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Orders.css";

const Orders = () => {
  const [order, setOrder] = useState({ title: "", description: "", price: "" });
  const [message, setMessage] = useState("");

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post("/api/user/profile/orders", order, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrder({ title: "", description: "", price: "" });
      setMessage("Заказ успешно создан!");
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      setMessage("Ошибка при создании заказа.");
    }
  };

  return (
    <div className="create-order-page">
      <div className="container py-5">
        <h2 className="section-title">Выставить заказ</h2>
        <div className="create-order-card">
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={handleCreateOrder}>
            <div className="mb-3">
              <label className="form-label">Название</label>
              <input
                type="text"
                className="form-control"
                value={order.title}
                onChange={(e) => setOrder({ ...order, title: e.target.value })}
                placeholder="Введите название заказа"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Описание</label>
              <textarea
                className="form-control"
                value={order.description}
                onChange={(e) => setOrder({ ...order, description: e.target.value })}
                placeholder="Опишите заказ"
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
                placeholder="Введите цену (например, 100 000 тг)"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Выставить заказ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Orders;

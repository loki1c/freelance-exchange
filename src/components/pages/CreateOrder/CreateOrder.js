import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreateOrder.css";

const CreateOrder = () => {
  const [order, setOrder] = useState({ title: "", description: "", price: "" });
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Создан заказ:", order);
    setSuccess("Заказ успешно создан!");
    setOrder({ title: "", description: "", price: "" });
  };

  return (
    <div className="create-order-page">
      <div className="container py-5">
        <h2 className="section-title">Выставить заказ</h2>
        <div className="create-order-card">
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
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

export default CreateOrder;
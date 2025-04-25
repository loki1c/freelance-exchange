import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Orders.css";

const Orders = () => {
  const [order, setOrder] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    deadline: "",
    file: null, // Добавляем состояние для файла
  });
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);

  const token = localStorage.getItem("token");

  // Используем useCallback для избежания перерасчета функции fetchOrders
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("/api/user/profile/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке заказов:", err);
      setMessage("Произошла ошибка при загрузке заказов.");
    }
  }, [token]);

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

  const handleFileChange = (e) => {
    setOrder((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("title", order.title);
    formData.append("description", order.description);
    formData.append("price", order.price);
    formData.append("category", order.category);
    formData.append("deadline", order.deadline);

    // Добавляем файл, если он выбран
    if (order.file) {
      formData.append("file", order.file);
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data", // Устанавливаем тип контента как multipart/form-data
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (isEditing) {
        await axios.put(`/api/user/profile/orders/${editOrderId}`, formData, config);
        setMessage("Заказ успешно обновлён!");
      } else {
        await axios.post("/api/user/profile/orders", formData, config);
        setMessage("Заказ успешно создан!");
      }

      setOrder({
        title: "",
        description: "",
        price: "",
        category: "",
        deadline: "",
        file: null, // Сбрасываем файл после отправки
      });
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
                onChange={(e) => setOrder((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Описание</label>
              <textarea
                className="form-control"
                value={order.description}
                onChange={(e) => setOrder((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Цена</label>
              <input
                type="number"
                className="form-control"
                value={order.price}
                onChange={(e) => setOrder((prev) => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Категория</label>
              <select
                className="form-control"
                value={order.category}
                onChange={(e) => setOrder((prev) => ({ ...prev, category: e.target.value }))}
                required
              >
                <option value="">Выберите категорию</option>
                <option value="Desktop Development">Десктопная разработка</option>
                <option value="Mobile Development">Мобильная разработка</option>
                <option value="Web Backend">Бэкенд: C++, Python, Java, C#</option>
                <option value="Web Frontend">Фронтенд: JavaScript, TypeScript</option>
                <option value="Game Development">Разработка игр</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Срок выполнения</label>
              <input
                type="date"
                className="form-control"
                value={order.deadline}
                onChange={(e) => setOrder((prev) => ({ ...prev, deadline: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Прикрепить файл</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Сохранить изменения" : "Создать заказ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Orders;

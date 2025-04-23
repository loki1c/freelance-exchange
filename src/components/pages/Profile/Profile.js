import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    city: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Флаг редактирования данных профиля

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchUserData();
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

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const user = response.data.user;
      setUserData({
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        city: user.city,
        email: user.email,
      });
    } catch (error) {
      console.error("Ошибка при загрузке данных пользователя:", error);
      setMessage("Не удалось загрузить данные профиля.");
    }
  };

  const handleEdit = (order) => {
    localStorage.setItem("editOrder", JSON.stringify(order));
    window.location.href = "profile/orders";
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

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/user/profile", userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setMessage("Данные успешно обновлены.");
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      setMessage("Не удалось обновить данные.");
    }
  };

  return (
    <div className="profile-page">
      <div className="container py-5">
        <h2 className="section-title">Мой профиль</h2>

        <div className="d-flex justify-content-end mb-4">
          <a href="/profile/orders" className="btn btn-success custom-btn">
            Создать заказ
          </a>
        </div>

        <h3 className="section-title">Мои данные</h3>
        {message && <p className="alert alert-info">{message}</p>}
        
        {isEditing ? (
          <form onSubmit={handleSaveChanges}>
            <div className="mb-3">
              <label className="form-label">Имя</label>
              <input
                type="text"
                name="firstname"
                className="form-control"
                value={userData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Фамилия</label>
              <input
                type="text"
                name="lastname"
                className="form-control"
                value={userData.lastname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Телефон</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={userData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Город</label>
              <input
                type="text"
                name="city"
                className="form-control"
                value={userData.city}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Сохранить изменения
            </button>
          </form>
        ) : (
          <div>
            <p><strong>Имя:</strong> {userData.firstname}</p>
            <p><strong>Фамилия:</strong> {userData.lastname}</p>
            <p><strong>Телефон:</strong> {userData.phone}</p>
            <p><strong>Город:</strong> {userData.city}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <button
              className="btn btn-warning"
              onClick={() => setIsEditing(true)}
            >
              Редактировать
            </button>
          </div>
        )}

        <h3 className="section-title mt-5">Мои заказы</h3>
        {orders.length === 0 ? (
          <p className="no-orders">У вас пока нет заказов.</p>
        ) : (
          <div className="row g-4">
            {orders.map((order) => (
              <div className="col-md-4" key={order.id}>
                <div className="order-card">
                  <img
                    src={order.image || "https://via.placeholder.com/400x200"}
                    alt={order.title}
                    className="order-image"
                  />
                  <div className="order-info">
                    <h5 className="order-title">{order.title}</h5>
                    <p className="order-description">{order.description}</p>
                    <p className="order-price">{order.price} тг</p>
                    <div className="order-actions d-flex justify-content-between">
                      <button
                        className="btn btn-warning custom-btn me-2"
                        onClick={() => handleEdit(order)}
                      >
                        Редактировать
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

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    city: "",
    email: "",
    photo: "",
    photoFile: null,
  });
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchUserData();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user/profile/orders",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке заказов:", error);
      setMessage("Не удалось загрузить заказы.");
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user/profile",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const user = response.data.user;
      setUserData({
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        city: user.city,
        email: user.email,
        photo: user.photo,
      });
    } catch (error) {
      console.error("Ошибка при загрузке данных пользователя:", error);
      setMessage("Не удалось загрузить данные профиля.");
    }
  };

  const handleEdit = () => {
    navigate("/profile/orders");
  };

  const handleDeleteOrder = async (order) => {
    setMessage("");
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/user/profile/orders/${order.id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setUserData((prev) => ({ ...prev, photoFile: file }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("firstname", userData.firstname);
    formData.append("lastname", userData.lastname);
    formData.append("phone", userData.phone);
    formData.append("city", userData.city);
    formData.append("email", userData.email);
    if (userData.photoFile) formData.append("photo", userData.photoFile);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/user/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Данные успешно обновлены.");
      setIsEditing(false);
      fetchUserData();
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      if (error.response?.data?.errors) {
        const errMsgs = Object.values(error.response.data.errors)
          .flat()
          .join(" ");
        setMessage(errMsgs);
      } else {
        setMessage("Не удалось обновить данные.");
      }
    }
  };

  if (message && message.startsWith("Ошибка")) {
    // можно стилизовать под alert-danger, если нужно
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h2 className="section-title">Мой профиль</h2>

        {message && <p className="alert alert-info">{message}</p>}

        <div className="profile-content">
          {isEditing ? (
            <form
              onSubmit={handleSaveChanges}
              encType="multipart/form-data"
              className="profile-form-card"
            >
              <label className="form-label">Фото профиля</label>
              <br />
              {userData.photo && (
                <img
                  src={`http://127.0.0.1:8000/storage/${userData.photo}`}
                  alt="Аватар"
                  className="img-thumbnail"
                  width="150"
                />
              )}
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="custom-input mb-3"
              />

              <input
                type="text"
                name="firstname"
                className="custom-input"
                value={userData.firstname}
                onChange={handleChange}
                placeholder="Имя"
                required
              />
              <input
                type="text"
                name="lastname"
                className="custom-input"
                value={userData.lastname}
                onChange={handleChange}
                placeholder="Фамилия"
                required
              />
              <input
                type="text"
                name="phone"
                className="custom-input"
                value={userData.phone}
                onChange={handleChange}
                placeholder="Телефон"
              />
              <input
                type="text"
                name="city"
                className="custom-input"
                value={userData.city}
                onChange={handleChange}
                placeholder="Город"
              />
              <input
                type="email"
                name="email"
                className="custom-input"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              <button
                type="submit"
                className="btn btn-primary custom-btn mt-3"
              >
                Сохранить изменения
              </button>
            </form>
          ) : (
            <div className="profile-info-card">
              <p>
                <strong>Имя:</strong> {userData.firstname}
              </p>
              <p>
                <strong>Фамилия:</strong> {userData.lastname}
              </p>
              <p>
                <strong>Телефон:</strong> {userData.phone}
              </p>
              <p>
                <strong>Город:</strong> {userData.city}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              {userData.photo && (
                <img
                  src={`http://127.0.0.1:8000/storage/${userData.photo}`}
                  alt="Аватар"
                  className="img-thumbnail"
                  width="150"
                />
              )}
              <div className="profile-actions">
                <button
                  className="btn btn-warning custom-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Редактировать
                </button>
                <Link
                  to="/profile/orders"
                  className="btn btn-success custom-btn"
                >
                  Создать заказ
                </Link>
              </div>
            </div>
          )}

          <div className="orders-section">
            <h3 className="section-title mt-5">Мои заказы</h3>
            {orders.length === 0 ? (
              <p className="no-orders">У вас пока нет заказов.</p>
            ) : (
              <div className="row g-4">
                {orders.map((order) => (
                  <div className="col-md-4" key={order.id}>
                    <div className="order-card">
                      <img
                        src={
                          order.image ||
                          "https://via.placeholder.com/400x200"
                        }
                        alt={order.title}
                        className="order-image"
                      />
                      <div className="order-info">
                        <h5 className="order-title">{order.title}</h5>
                        <p className="order-description">
                          {order.description}
                        </p>
                        <p className="order-price">
                          {order.price} тг
                        </p>
                        <div className="order-actions">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(order)}
                          >
                            Редактировать
                          </button>
                          <button
                            className="btn-delete"
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
      </div>
    </div>
  );
};

export default Profile;

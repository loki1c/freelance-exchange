import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Импортируем useNavigate и Link
import "bootstrap/dist/css/bootstrap.min.css";
import "./Registration.css";

const Registration = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(""); // Для отображения ошибки
  const navigate = useNavigate(); // Для навигации

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Очистка ошибок перед запросом

    try {
      const response = await axios.post("/api/registration", formData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        withCredentials: true, // Чтобы куки сохранялись
      });

      console.log("Ответ сервера:", response.data);

      // Сохранение токена в localStorage
      localStorage.setItem("token", response.data.token);

      // Перенаправление пользователя на страницу входа
      navigate("/login");

    } catch (err) {
      console.error("Ошибка регистрации:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="registration-page">
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="registration-card">
          <h2 className="text-center mb-4">Регистрация</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Имя</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Введите ваше имя"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Введите email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Пароль</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Зарегистрироваться
            </button>
          </form>
          <p className="text-center mt-3">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;

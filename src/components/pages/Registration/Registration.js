import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Registration.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    login: "",
    firstname: "",
    lastname: "",
    phone: "",
    city: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const cities = [
    "Актау", "Актобе", "Алматы", "Астана", "Атырау", "Балхаш",
    "Екибастуз", "Жезказган", "Жетысай", "Караганда", "Кокшетау",
    "Костанай", "Кулсары", "Кызылорда", "Павлодар", "Петропавловск",
    "Риддер", "Семей", "Степногорск", "Талдыкорган", "Тараз",
    "Текели", "Темиртау", "Туркестан", "Уральск", "Усть-Каменогорск",
    "Шалкар", "Шардара", "Шахтинск", "Шемонаиха", "Шымкент",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password_confirmation) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/registration", formData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        withCredentials: true,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="registration-page">
      <div className="container">
        <div className="registration-card">
          <h2>Регистрация</h2>
          {error && <div className="alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Логин</label>
              <input
                type="text"
                name="login"
                className="form-control"
                placeholder="Введите логин"
                value={formData.login}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Имя</label>
                <input
                  type="text"
                  name="firstname"
                  className="form-control"
                  placeholder="Введите ваше имя"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Фамилия</label>
                <input
                  type="text"
                  name="lastname"
                  className="form-control"
                  placeholder="Введите вашу фамилию"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Телефон</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="Введите телефон"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Город</label>
              <select
                name="city"
                className="form-control"
                value={formData.city}
                onChange={handleChange}
                required
              >
                <option value="">Выберите город</option>
                {cities.map((city, idx) => (
                  <option key={idx} value={city}>{city}</option>
                ))}
              </select>
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

            <div className="form-row">
              <div className="form-group">
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
              <div className="form-group">
                <label className="form-label">Подтверждение пароля</label>
                <input
                  type="password"
                  name="password_confirmation"
                  className="form-control"
                  placeholder="Подтвердите пароль"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">Зарегистрироваться</button>
          </form>
          <p>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;

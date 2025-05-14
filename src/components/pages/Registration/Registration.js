import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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
    password_confirmation: "", // Добавлено поле для подтверждения пароля
  });
  const [error, setError] = useState(""); // Для отображения ошибки
  const navigate = useNavigate(); // Для навигации

  // Жестко закодированный список городов
  const cities = [
    'Актау', 'Актобе', 'Алматы', 'Астана', 'Атырау', 'Балхаш',
    'Екибастуз', 'Жезказган', 'Жетысай', 'Караганда', 'Кокшетау',
    'Костанай', 'Кулсары', 'Кызылорда', 'Павлодар', 'Петропавловск',
    'Риддер', 'Семей', 'Степногорск', 'Талдыкорган', 'Тараз',
    'Текели', 'Темиртау', 'Туркестан', 'Уральск', 'Усть-Каменогорск',
    'Шалкар', 'Шардара', 'Шахтинск', 'Шемонаиха', 'Шымкент'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Очистка ошибок перед запросом

    // Проверка на совпадение паролей
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
            <div className="mb-3">
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
            <div className="mb-3">
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
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
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
            <div className="mb-3">
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

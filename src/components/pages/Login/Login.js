import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.css"; // Новый стиль

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Очистка ошибок перед запросом

    try {
      // Отправляем запрос на сервер
      const response = await axios.post("/api/login", {
        email,
        password,
      }, { withCredentials: true });

      console.log("Успешный вход:", response.data);

      // Сохранение токена в localStorage
      localStorage.setItem("token", response.data.token);

      // Перенаправление пользователя на главную страницу
      window.location.href = "/profile";
      
    } catch (err) {
      // Обработка ошибки
      console.error("Ошибка входа:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Ошибка входа");
    }
  };

  return (
    <div className="login-page">
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="login-card">
          <h2 className="text-center mb-4">Вход</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Пароль</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Войти
            </button>
          </form>
          <p className="text-center mt-3">
            Нет аккаунта? <Link to="/registration">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

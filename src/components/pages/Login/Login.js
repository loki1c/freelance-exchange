import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext); // <-- получаем login из контекста
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      }, { withCredentials: true });

      console.log("Успешный вход:", response.data);

      // Сохраняем токен (если нужен)
      localStorage.setItem("token", response.data.token);

      // Вызываем login из контекста, передаём пользователя
      const userData = {
        email: response.data.user.email,
        name: response.data.user.name,
        // любые другие данные пользователя
      };
      login(userData); // <-- обновляем контекст

      navigate("/profile"); // редирект

    } catch (err) {
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

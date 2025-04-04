import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Отправляем запрос на вход:", { email, password });
      const response = await fetch("http://your-backend-api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Ответ от сервера:", response);
      const data = await response.json();
      console.log("Данные от сервера:", data);

      if (response.ok) {
        login(data.user);
        localStorage.setItem("token", data.token);
        navigate("/profile");
      } else {
        setError(data.message || "Ошибка входа");
      }
    } catch (err) {
      setError("Не удалось подключиться к серверу. Проверьте соединение.");
      console.error("Ошибка при входе:", err);
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
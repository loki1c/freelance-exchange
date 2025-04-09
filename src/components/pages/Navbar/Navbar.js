import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import ChatWindow from "./ChatWindow";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext); // Получаем user из контекста
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateOrderClick = () => {
    if (isAuthenticated) {
      navigate("/create-order");
    } else {
      navigate("/auth-required");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          SkillMarket
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/AllOrder">
                Найти заказ
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link custom-nav-button"
                onClick={handleCreateOrderClick}
              >
                Разместить задание
              </button>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link custom-nav-link" to="/profile">
                    {user?.name || "Мой профиль"} {/* Отображаем имя пользователя */}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link custom-nav-button"
                    onClick={() => setIsChatOpen(true)}
                  >
                    Чаты
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link custom-nav-button logout"
                    onClick={() => {
                      logout(); // Вызываем logout из контекста
                      navigate("/"); // Перенаправляем на главную страницу после выхода
                    }}
                  >
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link custom-nav-link" to="/login">
                  Вход
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} />}
    </nav>
  );
};

export default Navbar;
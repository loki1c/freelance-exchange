import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import ChatWindow from "../Chat/ChatWindow";
import { ReactComponent as ProfileIcon } from './icons/profile-icon.svg';
import { ReactComponent as CartIcon } from './icons/cart-icon.svg'; // Add cart icon here
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateOrderClick = () => {
    if (isAuthenticated) {
      navigate("/profile/orders");
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
                    <ProfileIcon className="profile-icon" />
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
                      logout();
                      navigate("/");
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
            {/* Add cart icon */}
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/cart">
                <CartIcon className="cart-icon" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} />}
    </nav>
  );
};

export default Navbar;

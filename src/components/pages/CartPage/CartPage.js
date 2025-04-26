import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const [cartOrders, setCartOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartOrders();
  }, []);

  const fetchCartOrders = async () => {
    try {
      const token = localStorage.getItem("token"); // Твой токен для авторизации
      const response = await axios.get("/api/user/profile/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartOrders(response.data);
    } catch (error) {
      console.error("Ошибка загрузки корзины:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="cart-loading">Загрузка корзины...</div>;
  }

  if (cartOrders.length === 0) {
    return <div className="cart-empty">Ваша корзина пуста.</div>;
  }

  return (
    <div className="cart-container">
      <h2>Моя корзина</h2>
      <div className="cart-orders">
        {cartOrders.map((order) => (
          <div key={order.id} className="cart-order-card">
            <h3>{order.title}</h3>
            <p>{order.description}</p>
            <p>Цена: {order.price} ₸</p>
            <Link className="view-order-button" to={`/profile/orders/${order.id}`}>
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartPage;

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
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/user/profile/cart", {
        headers: { Authorization: `Bearer ${token}` },
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
    <div className="cart-order-page">
      <div className="container">
        <div className="cart-header">
          <h2 className="section-title">Моя корзина</h2>
          <p className="cart-subtitle">Вот ваши текущие заказы</p>
        </div>

        <div className="cart-orders">
          {cartOrders.map((order) => (
            <div key={order.id} className="cart-order-card">
              <h3 className="cart-order-title">{order.title}</h3>
              <p className="cart-order-description">{order.description}</p>
              <div className="cart-order-footer">
                <span className="cart-order-price">Цена: {order.price} ₸</span>
                <Link className="view-order-button" to={`/profile/orders/${order.id}`}>
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;

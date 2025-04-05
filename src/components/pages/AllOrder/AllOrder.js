import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AllOrder.css";

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/user/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the orders!", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white">Загрузка...</div>;

  return (
    <div className="find-order-page">
      <div className="container py-5">
        <h2 className="section-title">Найти заказ</h2>
        {orders.length === 0 ? (
          <p className="text-white">Нет доступных заказов.</p>
        ) : (
          <div className="row g-4">
            {orders.map((order) => (
              <div className="col-md-4" key={order.id}>
                <div className="order-card">
                  <img
                    src={order.image || "URL_ДЛЯ_КАРТИНКИ_1"} // добавьте изображение, если оно есть
                    alt={order.title}
                    className="order-image"
                  />
                  <div className="order-info">
                    <h5 className="order-title">{order.title}</h5>
                    <p className="order-description">{order.description}</p>
                    <p className="order-price">{order.price}</p>
                    <Link
                      to={`/order/${order.id}`}
                      className="btn btn-primary"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrder;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AllOrders.css";
import { api } from "../../api/api";

const AllOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const data = await api.get("/orders", token);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-white text-center">Загрузка...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="container py-5">
      <h2>Все заказы</h2>
      {orders.length === 0 ? (
        <p>Заказов пока нет.</p>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div className="col-md-4" key={order.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{order.title}</h5>
                  <p className="card-text">{order.description}</p>
                  <p className="text-primary fw-bold">{order.price}</p>
                  <p className="text-muted">Статус: {order.status}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
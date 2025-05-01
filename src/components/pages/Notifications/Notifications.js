import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/notifications', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // токен авторизации
      },
      withCredentials: true // если используется sanctum
    })
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleApprove = (orderId, requestId) => {
    axios.post(`http://localhost:8000/api/user/profile/orders/${orderId}/approve-request/${requestId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true, // если используется Laravel Sanctum
    })
      .then(res => {
        alert(res.data.message); // уведомление об успехе
        setRequests(prev => prev.filter(r => r.id !== requestId)); // удаляем принятый запрос из списка
        navigate(`/profile/orders/${orderId}`); // перенаправление на страницу заказа
      })
      .catch(err => {
        console.error("Ошибка при принятии запроса:", err);
        alert("Ошибка при принятии запроса");
      });
  };

  const pendingRequests = requests.filter(req => req.status === "Ожидает подтверждения");

  return (
    <div>
      <h2>Уведомления</h2>
      {pendingRequests.length === 0 ? (
        <p>Нет новых запросов</p>
      ) : (
        <ul>
          {pendingRequests.map(req => (
            <li key={req.id} style={{ marginBottom: "20px" }}>
              <strong>{req.user.firstname} {req.user.lastname}</strong> хочет выполнить заказ: <em>{req.order.title}</em><br />
              <button onClick={() => handleApprove(req.order.id, req.id)}>
                Принять запрос
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;

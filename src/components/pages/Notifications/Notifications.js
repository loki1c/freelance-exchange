import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [view, setView] = useState("incoming"); // incoming | my
  const [userOrders, setUserOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Получение входящих запросов (если ты владелец заказов)
    axios.get("http://127.0.0.1:8000/api/notifications", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    })
      .then(res => setIncomingRequests(res.data))
      .catch(err => console.error(err));

    // Получение собственных откликов на чужие заказы
    axios.get("http://127.0.0.1:8000/api/user/order/my-requests", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    })
      .then(res => setMyRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleApprove = (orderId, requestId) => {
    axios.post(`http://127.0.0.1:8000/api/user/profile/orders/${orderId}/approve-request/${requestId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    })
      .then(res => {
        alert(res.data.message);
        setIncomingRequests(prev => prev.filter(r => r.id !== requestId));
        navigate(`/profile/orders/${orderId}`);
      })
      .catch(err => {
        console.error("Ошибка при принятии запроса:", err);
        alert("Ошибка при принятии запроса");
      });
  };

  const fetchUserOrders = (userId) => {
    axios.get(`http://127.0.0.1:8000/api/user/profile/${userId}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    })
      .then(res => setUserOrders(res.data))
      .catch(err => console.error("Ошибка при загрузке заказов пользователя:", err));
  };

  const pendingIncoming = incomingRequests.filter(req => req.status === "Ожидает подтверждения");

  return (
    <div>
      <h2>Уведомления</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setView("incoming")} style={{ marginRight: "10px" }}>
          Запросы ко мне
        </button>
        <button onClick={() => setView("my")}>
          Мои отклики
        </button>
      </div>

      {view === "incoming" ? (
        <div>
          <h3>Запросы ко мне</h3>
          {pendingIncoming.length === 0 ? (
            <p>Нет новых запросов</p>
          ) : (
            <ul>
              {pendingIncoming.map(req => (
                <li key={req.id} style={{ marginBottom: "20px" }}>
                  <strong>
                    <a href={`/profile/${req.user.id}`} 
                       style={{ color: "blue", textDecoration: "underline" }}
                       onClick={() => fetchUserOrders(req.user.id)}>
                      {req.user.firstname} {req.user.lastname}
                    </a>
                  </strong> хочет выполнить заказ: <em>{req.order.title}</em><br />
                  <button onClick={() => handleApprove(req.order.id, req.id)}>
                    Принять запрос
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div>
          <h3>Мои отклики</h3>
          {myRequests.length === 0 ? (
            <p>Вы ещё не отправляли отклики</p>
          ) : (
            <ul>
              {myRequests.map(req => (
                <li key={req.id} style={{ marginBottom: "10px" }}>
                  Заказ: <strong>{req.order?.title || "Без названия"}</strong><br />
                  Статус: <em>{req.status}</em>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {userOrders.length > 0 && (
        <div>
          <h3>Публичные заказы пользователя</h3>
          <ul>
            {userOrders.map(order => (
              <li key={order.id}>
                <strong>{order.title}</strong><br />
                Статус: {order.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;

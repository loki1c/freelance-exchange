import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Notifications.css"; // новый CSS

const Notifications = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [view, setView] = useState("incoming"); // incoming | my
  const [userOrders, setUserOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((res) => setIncomingRequests(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://127.0.0.1:8000/api/user/order/my-requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((res) => setMyRequests(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleApprove = (orderId, requestId) => {
    axios
      .post(
        `http://127.0.0.1:8000/api/user/profile/orders/${orderId}/approve-request/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        alert(res.data.message);
        setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
        navigate(`/profile/orders/${orderId}`);
      })
      .catch((err) => {
        console.error("Ошибка при принятии запроса:", err);
        alert("Ошибка при принятии запроса");
      });
  };

  const fetchUserOrders = (userId) => {
    axios
      .get(`http://127.0.0.1:8000/api/user/profile/${userId}/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((res) => setUserOrders(res.data))
      .catch((err) =>
        console.error("Ошибка при загрузке заказов пользователя:", err)
      );
  };

  const pendingIncoming = incomingRequests.filter(
    (req) => req.status === "Ожидает подтверждения"
  );

  return (
    <div className="notifications-container">
      <h2>Уведомления</h2>

      <div style={{ marginBottom: 25 }}>
        <button
          onClick={() => setView("incoming")}
          style={{ opacity: view === "incoming" ? 1 : 0.6 }}
        >
          Запросы ко мне
        </button>
        <button
          onClick={() => setView("my")}
          style={{ opacity: view === "my" ? 1 : 0.6 }}
        >
          Мои отклики
        </button>
      </div>

      {view === "incoming" ? (
        <>
          <h3>Запросы ко мне</h3>
          {pendingIncoming.length === 0 ? (
            <p>Нет новых запросов</p>
          ) : (
            <ul style={{ paddingLeft: 0, listStyle: "none" }}>
              {pendingIncoming.map((req) => (
                <li
                  key={req.id}
                  className="list-group-item"
                  onClick={() => fetchUserOrders(req.user.id)}
                >
                  <span>
                    <strong>
                      <a href={`/profile/${req.user.id}`}>
                        {req.user.firstname} {req.user.lastname}
                      </a>
                    </strong>{" "}
                    хочет выполнить заказ: <em>{req.order.title}</em>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(req.order.id, req.id);
                    }}
                  >
                    Принять запрос
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <h3>Мои отклики</h3>
          {myRequests.length === 0 ? (
            <p>Вы ещё не отправляли отклики</p>
          ) : (
            <ul style={{ paddingLeft: 0, listStyle: "none" }}>
              {myRequests.map((req) => (
                <li key={req.id} className="list-group-item">
                  Заказ: <strong>{req.order?.title || "Без названия"}</strong>
                  <br />
                  Статус: <em>{req.status}</em>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {userOrders.length > 0 && (
        <>
          <h3>Публичные заказы пользователя</h3>
          <ul style={{ paddingLeft: 0, listStyle: "none" }}>
            {userOrders.map((order) => (
              <li key={order.id} className="list-group-item">
                <strong>{order.title}</strong>
                <br />
                Статус: {order.status}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Notifications;

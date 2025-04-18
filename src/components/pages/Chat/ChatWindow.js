import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChatWindow.css";

const ChatWindow = ({ orderId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Загрузка сообщений при изменении orderId
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/user/order/chat/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setMessages(response.data.data.messages); // Сохранение сообщений в состоянии
        } else {
          setError("Не удалось загрузить сообщения.");
        }
      } catch (err) {
        console.error(err);
        setError("Ошибка загрузки чата.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchMessages();
  }, [orderId, token]);

  // Отправка нового сообщения
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userId = getUserIdFromToken(token); // Получаем user_id из токена

    try {
      const response = await axios.post(
        "/api/user/order/chat",
        {
          order_id: orderId,
          user_id: userId, // Передаем user_id
          message: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.data]); // Добавляем новое сообщение в список
        setNewMessage(""); // Очищаем поле ввода
      } else {
        setError("Не удалось отправить сообщение.");
      }
    } catch (err) {
      console.error(err);
      setError("Ошибка при отправке.");
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h5>Чат по заказу #{orderId}</h5>
        <button className="btn btn-close" onClick={onClose}></button>
      </div>

      <div className="chat-body">
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="chat-messages">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${
                    msg.user_id === getUserIdFromToken(token)
                      ? "message-sent"
                      : "message-received"
                  }`}
                >
                  <strong>{msg.user?.name || "Пользователь"}:</strong>{" "}
                  <span>{msg.message}</span>
                  <small className="message-timestamp">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              ))
            ) : (
              <div className="no-messages">Сообщений пока нет.</div>
            )}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="message-form mt-2">
          <input
            type="text"
            className="form-control"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
          />
          <button type="submit" className="btn btn-primary mt-2 w-100">
            Отправить
          </button>
        </form>

        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>
    </div>
  );
};

// Вспомогательная функция для декодирования user_id из JWT (если тебе нужно)
function getUserIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub; // обычно id пользователя
  } catch (e) {
    return null;
  }
}

export default ChatWindow;

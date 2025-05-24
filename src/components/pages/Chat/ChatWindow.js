import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import "./ChatWindow.css";

const userColors = [
  "#198754", // цвет для текущего пользователя (синий)
  "#a7c7e7",
  "#f4a261",
  "#e76f51",
  "#2a9d8f",
  "#264653",
];

// Функция для вычисления цвета по userId
const getUserColor = (userId) => {
  if (!userId) return "#ccc";
  const index =
    userId
      .toString()
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % userColors.length;
  return userColors[index];
};

const ChatWindow = ({ orderId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recipientId, setRecipientId] = useState(null);
  const [chatId, setChatId] = useState(null);

  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  // Декодируем токен один раз
  const currentUserId = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch {
      return null;
    }
  }, [token]);

  // Прокрутка вниз
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChat = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/user/order/chat/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const chatData = data.chat;
        setChatId(chatData.id);

        const fetchedMessages = chatData.messages || [];
        setMessages(fetchedMessages);

        if (fetchedMessages.length > 0) {
          const firstIncoming = fetchedMessages.find(
            (msg) => msg.sender_id !== currentUserId
          );
          if (firstIncoming) {
            setRecipientId(firstIncoming.sender_id);
          } else {
            const fallback = fetchedMessages[0];
            const recipient =
              fallback.sender_id === currentUserId
                ? fallback.recipient_id
                : fallback.sender_id;
            setRecipientId(recipient);
          }
        }
      } catch {
        setError("Ошибка загрузки сообщений.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId && token) fetchChat();
  }, [orderId, token, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post(
        `http://127.0.0.1:8000/api/user/order/chat/${orderId}/message`,
        { content: newMessage, recipient_id: recipientId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newMsg = data.message;

      if (!recipientId) {
        const recipient =
          newMsg.sender_id === currentUserId
            ? newMsg.recipient_id
            : newMsg.sender_id;
        setRecipientId(recipient);
      }

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    } catch {
      setError("Ошибка при отправке сообщения.");
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h5>Чат по заказу #{orderId}</h5>
        <button
          className="btn btn-close"
          onClick={onClose}
          aria-label="Закрыть чат"
        ></button>
      </div>

      <div className="chat-body">
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <>
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isCurrentUser = msg.sender_id === currentUserId;
                const bgColor = isCurrentUser
                  ? userColors[0]
                  : getUserColor(msg.sender_id);
                const textColor = isCurrentUser ? "#fff" : "#000";

                return (
                  <div
                    key={msg.id}
                    className={`message ${
                      isCurrentUser ? "message-sent" : "message-received"
                    }`}
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    <strong>
                      {msg.sender?.firstname  || `Пользователь #${msg.sender_id}`}:
                    </strong>
                    <p>{msg.content}</p>
                    {msg.created_at && (
                      <span className="timestamp">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="no-messages">Сообщений пока нет.</div>
            )}
          </>
        )}

        <form onSubmit={handleSendMessage} className="message-form mt-2">
          <input
            type="text"
            className="form-control"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary mt-2 w-100">
            Отправить
          </button>
        </form>

        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>

      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ChatWindow;

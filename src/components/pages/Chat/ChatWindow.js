import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatWindow.css";

const ChatWindow = ({ orderId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recipientId, setRecipientId] = useState(null);
  const [chatId, setChatId] = useState(null);

  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  // Прокрутка вниз при добавлении нового сообщения
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Получение чата при изменении orderId или token
  useEffect(() => {
    const fetchChat = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/user/order/chat/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const chatData = response.data.chat;
        console.log("Chat data:", chatData); // Логируем данные чата для проверки
        setChatId(chatData.id);

        const fetchedMessages = chatData.messages || [];
        console.log("Fetched messages:", fetchedMessages); // Логируем сообщения
        setMessages(fetchedMessages);

        // Определяем recipientId (получателя)
        const currentUserId = getUserIdFromToken(token);

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
      } catch (err) {
        console.error("Ошибка при загрузке чата:", err);
        setError("Ошибка загрузки сообщений.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId && token) {
      fetchChat();
    }
  }, [orderId, token]);

  // Автоматическая прокрутка вниз при изменении сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Отправка нового сообщения
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const currentUserId = getUserIdFromToken(token);

      const response = await axios.post(
        `/api/user/order/chat/${orderId}/message`,
        {
          content: newMessage,
          recipient_id: recipientId, // может быть null, но Laravel обработает
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newMsg = response.data.message;
      console.log("New message:", newMsg); // Логируем новое сообщение

      // Определяем recipientId, если он еще не установлен
      if (!recipientId) {
        const recipient =
          newMsg.sender_id === currentUserId
            ? newMsg.recipient_id
            : newMsg.sender_id;
        setRecipientId(recipient);
      }

      // Добавляем новое сообщение в список сообщений
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      setError("Ошибка при отправке сообщения.");
    }
  };

  // Получение userId из токена
  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded token:", payload); // Добавьте логирование
      return payload.sub;
    } catch (e) {
      console.error("Ошибка при декодировании токена:", e);
      return null;
    }
  }

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
          msg.sender_id === getUserIdFromToken(token)
            ? "message-sent"
            : "message-received"
        }`}
      >
        <strong>
          {msg.sender?.name || `Пользователь #${msg.sender_id}`}:
        </strong>
        <p>{msg.content}</p>
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

      {/* Прокрутка вниз */}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ChatWindow;

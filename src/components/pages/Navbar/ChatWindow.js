import React, { useState, useEffect } from "react";
import "./ChatWindow.css";

const ChatWindow = ({ onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // Заглушка для списка диалогов (позже заменишь на fetch с бэкенда)
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        user: "Айдар",
        lastMessage: "Привет, как дела?",
        messages: [
          { id: 1, sender: "Айдар", content: "Привет, как дела?", timestamp: "10:00" },
          { id: 2, sender: "Вы", content: "Привет! Хорошо, а у тебя?", timestamp: "10:01" },
        ],
      },
      {
        id: 2,
        user: "Малика",
        lastMessage: "Когда будет готов заказ?",
        messages: [
          { id: 1, sender: "Малика", content: "Когда будет готов заказ?", timestamp: "09:30" },
        ],
      },
    ];
    setConversations(mockConversations);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: conv.messages.length + 1,
              sender: "Вы",
              content: newMessage,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
          lastMessage: newMessage,
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find((conv) => conv.id === selectedConversation.id));
    setNewMessage("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h5>Чаты</h5>
        <button className="btn btn-close" onClick={onClose}></button>
      </div>
      <div className="chat-body">
        <div className="chat-list">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`chat-item ${selectedConversation?.id === conv.id ? "active" : ""}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="chat-item-user">{conv.user}</div>
              <div className="chat-item-message">{conv.lastMessage}</div>
            </div>
          ))}
        </div>
        <div className="chat-messages">
          {selectedConversation ? (
            <>
              <div className="messages">
                {selectedConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.sender === "Вы" ? "message-sent" : "message-received"}`}
                  >
                    <strong>{msg.sender}: </strong>
                    <span>{msg.content}</span>
                    <small className="message-timestamp">{msg.timestamp}</small>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="message-form">
                <input
                  type="text"
                  className="form-control"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                />
                <button type="submit" className="btn btn-primary">
                  Отправить
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation">Выберите диалог</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
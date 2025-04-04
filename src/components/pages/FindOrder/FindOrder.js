import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FindOrder.css";

const FindOrder = () => {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [isListView, setIsListView] = useState(!id);

  useEffect(() => {
    if (isListView) {
      const mockOrders = [
        {
          id: 1,
          title: "Разработка сайта",
          description: "Нужен сайт для интернет-магазина.",
          price: "150 000 тг",
          image: "URL_ДЛЯ_КАРТИНКИ_1",
        },
        {
          id: 2,
          title: "SEO-продвижение",
          description: "Продвижение сайта в поисковиках.",
          price: "80 000 тг",
          image: "URL_ДЛЯ_КАРТИНКИ_2",
        },
      ];
      setOrder(mockOrders);
    } else {
      const mockOrder = {
        id,
        title: "Создание коротких обучающих роликов",
        description:
          "Требуется серия небольших обучающих видеороликов на тему ВИЧ, бактерий. Под ключ, с монтажом и озвучкой.",
        price: "По договоренности",
        duration: "7 дней",
        paymentType: "По договоренности",
        publicationDate: "2025-04-02 13:55",
        updateDate: "2025-04-02 13:58",
      };
      setOrder(mockOrder);
    }
  }, [id, isListView]);

  if (!order) return <div className="text-white">Загрузка...</div>;

  return (
    <div className="find-order-page">
      <div className="container py-5">
        {isListView ? (
          <>
            <h2 className="section-title">Найти заказ</h2>
            {order.length === 0 ? (
              <p className="text-white">Нет доступных заказов.</p>
            ) : (
              <div className="row g-4">
                {order.map((ord) => (
                  <div className="col-md-4" key={ord.id}>
                    <div className="order-card">
                      <img
                        src={ord.image}
                        alt={ord.title}
                        className="order-image"
                      />
                      <div className="order-info">
                        <h5 className="order-title">{ord.title}</h5>
                        <p className="order-description">{ord.description}</p>
                        <p className="order-price">{ord.price}</p>
                        <Link
                          to={`/order/${ord.id}`}
                          className="btn btn-primary"
                          onClick={() => setIsListView(false)}
                        >
                          Подробнее
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="section-title">{order.title}</h2>
            <div className="order-details-card">
              <h5 className="card-title">Информация по заданию</h5>
              <p>
                <strong>Описание:</strong> {order.description}
              </p>
              <p>
                <strong>Стоимость:</strong> {order.price}
              </p>
              <p>
                <strong>Срок выполнения:</strong> {order.duration}
              </p>
              <p>
                <strong>Варианты оплаты:</strong> {order.paymentType}
              </p>
              <p>
                <strong>Дата публикации:</strong> {order.publicationDate}
              </p>
              <p>
                <strong>Ещё на сайте:</strong> {order.updateDate}
              </p>
              {isAuthenticated ? (
                <button className="btn btn-primary mt-3">Откликнуться</button>
              ) : (
                <div className="alert alert-warning mt-3">
                  Заказ выполнять могут только авторизованные пользователи.{" "}
                  <Link to="/login">Войти</Link> или{" "}
                  <Link to="/registration">Зарегистрироваться</Link>.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FindOrder;
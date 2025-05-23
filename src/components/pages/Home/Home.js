import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

const Home = () => {
  // Популярные заказы
  const popularOrders = [
    {
      id: 1,
      title: "Разработка сайта",
      description: "by John Doe",
      price: "150 000 тг",
      image: "/razrab_site.jpg",
    },
    {
      id: 2,
      title: "Дизайн логотипа",
      description: "by Jane Smith",
      price: "50 000 тг",
      image: "/logo_home.jpg",
    },
    
  ];

  // Топ-фрилансеры
  const topFreelancers = [
    { name: "Leighton Kramer", earnings: "307 818 тг" },
    { name: "Haylie Accord",   earnings: "233 333 тг" },
    { name: "Bowen Higgins",   earnings: "201 801 тг" },
  ];

  // Отзывы наших пользователей
  const reviews = [
    {
      name: "Алексей Сербин",
      text: "SkillMarket — мой облачный офис с сотрудниками. Я владею юридическим сайтом «Автозаконы» и бывает, что нужны исполнители на конкретную задачу. В штат нет смысла брать человека, а найти на Workzilla — самое то. В отличие от других сервисов, здесь время на поиск исполнителя тратит сервис, а не вы."
    },
    {
      name: "Лиля Переводова",
      text: "Не представляю свою работу без SkillMarket. Я пользуюсь этой платформой, чтобы найти исполнителей и на личные задачи, и на рабочие. Здесь можно найти исполнителя практически на любую задачу. Это очень экономит время. Что немаловажно, если работа выполнена плохо, Workzilla вернёт деньги."
    },
    {
      name: "Дмитрий Данилин",
      text: "Мы недавно открыли «Додо Пицца» в Калифорнии. И нам требовалось в срочном порядке к утру отредактировать дизайн для листовок. Время в Калифорнии с Москвой различается на 12 часов, и наши дизайнеры спали. За пару часов мы решили задачу с помощью SkillMarket. Благодарим за услуги!"
    },
  ];

  // FAQ
  const faq = [
    {
      q: "Что такое SkillMarket?",
      a: "SkillMarket — это биржа фриланса, где заказчики и исполнители находят друг друга по всему миру быстро и безопасно."
    },
    {
      q: "Как разместить заказ?",
      a: "Нажмите «Разместить задание» в навбаре, заполните форму и дождитесь откликов от исполнителей."
    },
    {
      q: "Как оплатить работу?",
      a: "Оплата проходит через безопасный эскроу-счёт: вы переводите деньги сюда, а фрилансер получает их только после приёмки работы."
    },
    {
      q: "Где найти поддержку?",
      a: "Наш круглосуточный саппорт доступен по кнопке «Помощь» в низу страницы или через чат в боковом меню."
    },
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  // Подключаем Яндекс.Карты
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?apikey=5be82534-d5ae-4145-9cae-57c70f9282c1&lang=ru_RU";
    script.async = true;
    script.onload = () => {
      /* global ymaps */
      ymaps.ready(() => {
        new ymaps.Map("yandex-map", {
          center: [55.76, 37.64],
          zoom: 1,
          controls: ["zoomControl"]
        });
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-text">
            <h1 className="hero-title">
              Найди и создай крутые проекты с фрилансерами!
            </h1>
            <p className="hero-subtitle">
              Самая большая платформа для поиска исполнителей и заказов.
            </p>
          </div>
          <div className="hero-image">
            <img src="/woman.png" alt="Работа фрилансера" />
          </div>
        </div>
      </section>

      {/* Яндекс.Карта */}
      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Исполнители по всему миру</h2>
          <div id="yandex-map" className="map-container"></div>
        </div>
      </section>

      {/* Отзывы наших пользователей */}
      <section className="reviews-slider-section">
        <div className="container">
          <h2 className="section-title">Отзывы наших пользователей</h2>
          <div className="slider-track reviews-track">
            {reviews.concat(reviews).map((r, i) => (
              <div className="review-card" key={i}>
                <p className="review-text">{r.text}</p>
                <h5 className="review-name">{r.name}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Популярные заказы */}
      <section className="popular-section">
        <div className="container">
          <h2 className="section-title">Популярные заказы</h2>
          <div className="orders-list">
            {popularOrders.map(o => (
              <div className="order-card" key={o.id}>
                <img
                  src={o.image}
                  alt={o.title}
                  className="order-image-placeholder"
                />
                <div className="order-info">
                  <h5 className="order-title">{o.title}</h5>
                  <p className="order-description">{o.description}</p>
                  <p className="order-price">{o.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Топ-фрилансеры */}
      <section className="freelancers-section">
        <div className="container">
          <h2 className="section-title">Топ-фрилансеры</h2>
          <div className="freelancers-list">
            {topFreelancers.map((f,i) => (
              <div className="freelancer-card" key={i}>
                <h5 className="freelancer-name">{f.name}</h5>
                <p className="freelancer-earnings">{f.earnings}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Вопросы и ответы</h2>
          {faq.map((item, idx) => (
            <div
              className={`faq-item ${openFAQ===idx?"open":""}`}
              key={idx}
              onClick={()=>setOpenFAQ(openFAQ===idx?null:idx)}
            >
              <div className="faq-question">
                {item.q}
                <span className="faq-icon">{openFAQ===idx?"−":"+"}</span>
              </div>
              {openFAQ===idx && (
                <div className="faq-answer">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container text-center">
          <p className="footer-text">© 2025 SkillMarket. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

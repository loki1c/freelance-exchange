import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

const Home = () => {
  // Заглушка для популярных заказов
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
    {
      id: 3,
      title: "SEO-продвижение",
      description: "by Alex Brown",
      price: "80 000 тг",
      image: "/seo.jpg",
    },
  ];

  // Заглушка для топ-фрилансеров
  const topFreelancers = [
    {
      name: "Leighton Kramer",
      earnings: "307 818 тг",
      image: "/Leo.jpg",
      portfolio: [
        "https://i.pinimg.com/736x/02/76/39/0276394adf72fa960b56b431c82a30e8.jpg",
        "https://i.pinimg.com/736x/73/26/e0/7326e0d56596a2ded8de8397b27e8742.jpg",
        "https://i.pinimg.com/736x/2a/06/41/2a0641ebc3031e72e5737a89f6c9324d.jpg",
      ],
    },
    {
      name: "Haylie Accord",
      earnings: "233 333 тг",
      image: "/hal.jpg",
      portfolio: [
        "https://i.pinimg.com/736x/e1/07/73/e1077308d342d8dbaaf7e08aff1e3518.jpg",
        "https://i.pinimg.com/736x/ce/f4/08/cef4088d8cac5e3a73611730d450e5f7.jpg",
        "https://i.pinimg.com/736x/fd/be/38/fdbe3894459e8b70bf9fe2015a3c538c.jpg",
      ],
    },
    {
      name: "Bowen Higgins",
      earnings: "201 801 тг",
      image: "https://img.freepik.com/premium-photo/fitness-tracking-track-distance-steps-workout-watch-tracker-sport-gadgets-best-score-monitoring-concept-check-heart-rate-athletic-man-check-smart-watch-handsome-athlete-use-digital-watch_474717-70572.jpg?ga=GA1.1.1226155640.1730874614&semt=ais_hybrid&w=740",
      portfolio: [
        "https://i.pinimg.com/236x/15/b0/58/15b058aa6f64f0f361c97eea1a0781ce.jpg",
        "https://i.pinimg.com/236x/78/08/4c/78084cbc246fba79b7baa7d0b2f1c42c.jpg",
        "https://i.pinimg.com/236x/81/70/21/817021e62cd0289302602b724ba5678b.jpg",
      ],
    },
  ];

  // Заглушка для отзывов (8 отзывов)
  const reviews = [
    {
      name: "Алексей Иванов",
      text: "Отличная платформа! Нашел фрилансера для разработки сайта за пару дней, результат превзошел ожидания.",
      rating: 5,
      image: "https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg?t=st=1743751504~exp=1743755104~hmac=ab9145f0faa7547ef287dd8f5eb88e9bc5f7ef77010274209a5394a52cf8a8a2&w=1060",
    },
    {
      name: "Мария Петрова",
      text: "Работаю фрилансером на этой платформе уже полгода. Много заказов, удобный интерфейс, рекомендую!",
      rating: 4,
      image: "https://img.freepik.com/free-photo/smiling-beautiful-young-woman-standing-posing_171337-11412.jpg?t=st=1743751552~exp=1743755152~hmac=9da2dcd27a1fbf240462bcbd13394bf45499a9d446fdd2198de21b731021d0fa&w=360",
    },
    {
      name: "Дмитрий Смирнов",
      text: "Хороший выбор фрилансеров, но хотелось бы больше фильтров для поиска. В целом, доволен.",
      rating: 4,
      image: "https://img.freepik.com/free-photo/portrait-handsome-smiling-hipster-lumbersexual-businessman-model-wearing-casual-white-sweater-trousers_158538-18947.jpg?t=st=1743751579~exp=1743755179~hmac=43ebccf6ce8d9a54d9549811b39085727ce82c52a5d458932b18354b2af561ac&w=1060",
    },
    {
      name: "Екатерина Соколова",
      text: "Заказывала дизайн логотипа, все сделали быстро и качественно. Спасибо!",
      rating: 5,
      image: "https://img.freepik.com/free-photo/stylish-confident-businesswoman-smiling_176420-19466.jpg?ga=GA1.1.1226155640.1730874614&semt=ais_hybrid&w=740",
    },
    {
      name: "Иван Кузнецов",
      text: "Платформа удобная, но иногда бывают задержки с оплатой. В остальном все отлично.",
      rating: 3,
      image: "https://img.freepik.com/free-photo/man-dressing-gown-with-his-arms-crossed_1368-1702.jpg?ga=GA1.1.1226155640.1730874614&semt=ais_hybrid&w=740",
    },
    {
      name: "Анна Лебедева",
      text: "Нашла здесь заказ на копирайтинг, клиент был очень доволен. Рекомендую!",
      rating: 5,
      image: "https://img.freepik.com/free-photo/happy-middle-aged-woman-relaxing-outdoors_23-2148979101.jpg?ga=GA1.1.1226155640.1730874614&semt=ais_hybrid&w=740",
    },
    {
      name: "Сергей Попов",
      text: "Хорошая платформа для старта карьеры фрилансера. Много заказов для новичков.",
      rating: 4,
      image: "https://img.freepik.com/free-photo/handsome-young-man-white-t-shirt-cross-arms-chest-smiling-pleased_176420-21607.jpg?ga=GA1.1.1226155640.1730874614&semt=ais_hybrid&w=740",
    },
    {
      name: "Ольга Новикова",
      text: "Заказывала анимацию для проекта, результат превзошел ожидания. Спасибо фрилансеру!",
      rating: 5,
      image: "https://img.freepik.com/premium-photo/portrait-smiling-young-woman-against-white-background_1048944-21300333.jpg?ga=GA1.1.1226155640.1730874614&semt=ais_hybrid&w=740",
    },
  ];

  // Удваиваем массив отзывов для эффекта бесконечного цикла
  const doubledReviews = [...reviews, ...reviews];

  // Состояния для фрилансеров
  const [currentFreelancerIndex, setCurrentFreelancerIndex] = useState(0);
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Автоматическое перелистывание фрилансеров
  useEffect(() => {
    const freelancerInterval = setInterval(() => {
      if (!isHovered) {
        setCurrentFreelancerIndex((prevIndex) =>
          (prevIndex + 1) % topFreelancers.length
        );
        setPortfolioIndex(0); // Сбрасываем индекс портфолио при смене фрилансера
      }
    }, 5000); // Перелистывание фрилансеров каждые 5 секунд

    return () => clearInterval(freelancerInterval);
  }, [isHovered]);

  // Автоматическое перелистывание работ текущего фрилансера
  useEffect(() => {
    const portfolioInterval = setInterval(() => {
      if (!isHovered) {
        setPortfolioIndex((prevIndex) => {
          const portfolioLength = topFreelancers[currentFreelancerIndex].portfolio.length;
          return (prevIndex + 1) % portfolioLength;
        });
      }
    }, 3000); // Перелистывание работ каждые 3 секунды

    return () => clearInterval(portfolioInterval);
  }, [currentFreelancerIndex, isHovered]);

  const handlePortfolioChange = (direction) => {
    const portfolioLength = topFreelancers[currentFreelancerIndex].portfolio.length;
    if (direction === "next") {
      setPortfolioIndex((prevIndex) => (prevIndex + 1) % portfolioLength);
    } else {
      setPortfolioIndex((prevIndex) => (prevIndex - 1 + portfolioLength) % portfolioLength);
    }
  };

  return (
    <div className="home-page">
      {/* Хедер */}
      <header className="header-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="header-title">
                Найди и создай крутые проекты с фрилансерами!
              </h1>
              <p className="header-subtitle">
                Самая большая платформа для поиска фрилансеров и заказов. Создавай, находи и зарабатывай!
              </p>
              <div className="header-stats">
                <div className="stat-item">
                  <span className="stat-number">27K+</span>
                  <span className="stat-label">Заказов</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">20K+</span>
                  <span className="stat-label">Фрилансеров</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">7K+</span>
                  <span className="stat-label">Активных пользователей</span>
                </div>
              </div>
              <button className="btn btn-primary mt-4">Начать</button>
            </div>
            <div className="col-md-6">
              <img
                src="/robot2.png"
                alt="Robot Illustration"
                className="robot-image"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Популярные заказы */}
      <section className="popular-section">
        <div className="container">
          <h2 className="section-title">Популярные заказы</h2>
          <div className="row">
            {popularOrders.map((order) => (
              <div className="col-md-4" key={order.id}>
                <div className="order-card">
                  <img
                    src={order.image}
                    alt={order.title}
                    className="order-image"
                  />
                  <div className="order-info">
                    <h5 className="order-title">{order.title}</h5>
                    <p className="order-description">{order.description}</p>
                    <p className="order-price">{order.price}</p>
                  </div>
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
          <div
            className="freelancer-window"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="freelancer-header">
              <img
                src={topFreelancers[currentFreelancerIndex].image}
                alt={topFreelancers[currentFreelancerIndex].name}
                className="freelancer-image"
              />
              <div className="freelancer-info">
                <h5 className="freelancer-name">{topFreelancers[currentFreelancerIndex].name}</h5>
                <p className="freelancer-earnings">{topFreelancers[currentFreelancerIndex].earnings}</p>
              </div>
            </div>
            <div className="portfolio-carousel">
              <button
                className="carousel-btn prev"
                onClick={() => handlePortfolioChange("prev")}
              >
                ←
              </button>
              <img
                src={topFreelancers[currentFreelancerIndex].portfolio[portfolioIndex]}
                alt={`${topFreelancers[currentFreelancerIndex].name} Portfolio`}
                className="portfolio-image"
                key={portfolioIndex}
              />
              <button
                className="carousel-btn next"
                onClick={() => handlePortfolioChange("next")}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="reviews-section">
        <div className="container">
          <h2 className="section-title">Отзывы</h2>
          <div className="reviews-carousel">
            {doubledReviews.map((review, index) => (
              <div className="review-card" key={index}>
                <div className="review-header">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="review-image"
                  />
                  <div className="review-info">
                    <h5 className="review-name">{review.name}</h5>
                    <p className="review-rating">
                      {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                    </p>
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="footer-section">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5 className="footer-title">SkillMarket</h5>
              <p className="footer-text">
                Самая большая платформа для поиска фрилансеров и заказов.
              </p>
            </div>
            <div className="col-md-2">
              <h5 className="footer-title">Explore</h5>
              <ul className="footer-links">
                <li>Art</li>
                <li>Photography</li>
                <li>Music</li>
                <li>Games</li>
              </ul>
            </div>
            <div className="col-md-2">
              <h5 className="footer-title">My Account</h5>
              <ul className="footer-links">
                <li>Profile</li>
                <li>Favorites</li>
                <li>Settings</li>
              </ul>
            </div>
            <div className="col-md-2">
              <h5 className="footer-title">Resources</h5>
              <ul className="footer-links">
                <li>Help Center</li>
                <li>Partners</li>
                <li>Newsletters</li>
              </ul>
            </div>
            <div className="col-md-2">
              <h5 className="footer-title">Company</h5>
              <ul className="footer-links">
                <li>About</li>
                <li>Careers</li>
                <li>Ranking</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
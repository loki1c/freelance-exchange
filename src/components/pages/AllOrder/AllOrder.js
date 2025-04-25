import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AllOrder.css";

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [viewCounts, setViewCounts] = useState({}); // Состояние для хранения количества просмотров каждого заказа

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/user/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        setOrders(response.data);
        setFilteredOrders(response.data);
        setLoading(false);

        // Сет категории из всех заказов
        const uniqueCategories = [
          ...new Set(response.data.map((order) => order.category).filter((category) => category))
        ];
        setCategories(uniqueCategories);

        // Запрос на получение количества просмотров для каждого заказа
        const viewCountPromises = response.data.map(async (order) => {
          const viewCountResponse = await axios.get(`/api/user/profile/orders/${order.id}/view-count`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          return { orderId: order.id, viewCount: viewCountResponse.data.view_count };
        });

        const viewCountsData = await Promise.all(viewCountPromises);
        const viewCountsObj = viewCountsData.reduce((acc, { orderId, viewCount }) => {
          acc[orderId] = viewCount;
          return acc;
        }, {});
        setViewCounts(viewCountsObj);
      } catch (error) {
        console.error("There was an error fetching the orders!", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    if (category === "") {
      setFilteredOrders(orders);  // Показываем все заказы
    } else {
      setFilteredOrders(orders.filter((order) => order.category === category));  // Фильтруем заказы по выбранной категории
    }
  };

  if (loading) return <div className="text-white">Загрузка...</div>;

  return (
    <div className="find-order-page">
      <div className="container py-5">
        <h2 className="section-title">Найти заказ</h2>

        {/* Фильтрация по категориям */}
        <div className="category-filter mb-4">
          <label htmlFor="category">Выберите категорию:</label>
          <select
            id="category"
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Все категории</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-white">Нет доступных заказов.</p>
        ) : (
          <div className="row g-4">
            {filteredOrders.map((order) => (
              <div className="col-md-4" key={order.id}>
                <div className="order-card">
                  <img
                    src={order.image || "URL_ДЛЯ_КАРТИНКИ_1"} // добавьте изображение, если оно есть
                    alt={order.title}
                    className="order-image"
                  />
                  <div className="order-info">
                    <h5 className="order-title">{order.title}</h5>
                    <p className="order-description">{order.description}</p>
                    <p className="order-price">{order.price}</p>

                    {/* Категория заказа */}
                    <p className="order-category">
                      <strong>Категория:</strong> {order.category || "Не указано"}
                    </p>

                    {/* Дедлайн заказа */}
                    <p className="order-deadline">
                      <strong>Дедлайн:</strong> {order.deadline ? new Date(order.deadline).toLocaleDateString() : "Не указан"}
                    </p>

                    {/* Количество просмотров */}
                    <p className="order-view-count">
                      <strong>Просмотры:</strong> {viewCounts[order.id] || 0}
                    </p>

                    <Link
                      to={`/profile/orders/${order.id}`}
                      className="btn btn-primary"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrder;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProfilePage() {
  const { id: userId } = useParams(); // получаем userId из URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/user/profile/${userId}/profile`);
        setUser(res.data.user);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (loading) return <p>Загрузка профиля...</p>;
  if (!user) return <p>Профиль не найден</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Профиль пользователя</h2>
      <div className="space-y-2 text-lg">
        {user.photo_url && <img src={user.photo_url} alt="Фото пользователя" className="w-32 h-32 rounded-full object-cover" />}
        <p><strong>Имя:</strong> {user.firstname}</p>
        <p><strong>Фамилия:</strong> {user.lastname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Телефон:</strong> {user.phone}</p>
        <p><strong>Город:</strong> {user.city}</p>
      </div>
    </div>
  );
}

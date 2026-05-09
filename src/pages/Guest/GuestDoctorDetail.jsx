import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const GuestDoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await api.get(`/guest/doctors/${id}/`);
        setDoctor(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні лікаря", error);
      }
    };

    fetchDoctor();
  }, [id]);

  if (!doctor) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>{doctor.full_name}</h2>

      <p>Посада: {doctor.position}</p>
      <p>Рейтинг: {doctor.average_rating || "Немає оцінок"}</p>

      <h3>Послуги</h3>

      {doctor.services.length === 0 ? (
        <p>Послуги не знайдено.</p>
      ) : (
        <ul>
          {doctor.services.map((service) => (
            <li key={service.id}>
              {service.name} — {service.price} грн
            </li>
          ))}
        </ul>
      )}

      <h3>Розклад</h3>

      {doctor.schedule.length === 0 ? (
        <p>Розклад ще не вказано.</p>
      ) : (
        <ul>
          {doctor.schedule.map((item, index) => (
            <li key={index}>
              {item.day_of_week}: {item.start_time.slice(0, 5)} —{" "}
              {item.end_time.slice(0, 5)}
            </li>
          ))}
        </ul>
      )}

      <h3>Відгуки</h3>

      {doctor.reviews.length === 0 ? (
        <p>Відгуків ще немає.</p>
      ) : (
        doctor.reviews.map((review) => (
          <div key={review.id}>
            <p>
              <strong>{review.patient}</strong> — {review.service}
            </p>
            <p>Оцінка: {review.rating}/5</p>
            <p>{review.comment}</p>
            <p>{new Date(review.date_created).toLocaleDateString("uk-UA")}</p>
          </div>
        ))
      )}

      <button onClick={() => navigate("/")}>Назад</button>
    </div>
  );
};

export default GuestDoctorDetail;

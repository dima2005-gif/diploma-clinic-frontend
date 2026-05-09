import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const GuestServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/guest/services/${id}/`);
        setService(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні послуги", error);
      }
    };

    fetchService();
  }, [id]);

  if (!service) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>{service.name}</h2>

      <p>{service.description}</p>
      <p>Вартість: {service.price} грн</p>

      <h3>Хто надає послугу</h3>

      {service.doctors.length === 0 ? (
        <p>Лікарів для цієї послуги не знайдено.</p>
      ) : (
        service.doctors.map((doctor) => (
          <div key={doctor.id}>
            <h4>{doctor.full_name}</h4>
            <p>{doctor.position}</p>

            <h5>Розклад</h5>

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

            <button onClick={() => navigate(`/doctors/${doctor.id}/`)}>
              Перейти до лікаря
            </button>
          </div>
        ))
      )}

      <button onClick={() => navigate("/")}>Назад</button>
    </div>
  );
};

export default GuestServiceDetail;

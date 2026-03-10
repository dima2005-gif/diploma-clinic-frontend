import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/patient/services/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Помилка при завантажені даних", error);
      }
    };
    fetchDetail();
  }, [id]);

  if (!data) return <div>Завантаження детальної інформації...</div>;

  return (
    <div className="analysis-page-detail">
      <h2>Деталі послуги: {data.service.name}</h2>
      <div className="analysis-card">
        <p>
          <strong>Опис:</strong> {data.service.description || "Опис відсутній"}
        </p>
        <p>
          <strong>Ціна:</strong> {data.service.price} грн
        </p>
        <h3>Лікарі, які надають цю послугу</h3>
        {data.employees.map((doctor, index) => (
          <div key={index}>
            <p>
              <strong>Лікар:</strong> {doctor.last_name} {doctor.first_name}{" "}
              {doctor.middle_name}
            </p>
            <p>
              <strong>Посада:</strong> {doctor.position.name}
            </p>
            <p>
              <strong>Графік:</strong>
            </p>
            {doctor.schedule.length > 0 ? (
              doctor.schedule.map((s, i) => (
                <p key={i}>
                  {s.day_of_week} — {s.start_time} до {s.end_time}
                </p>
              ))
            ) : (
              <p>Не вказано</p>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => navigate(-1)}>Повернутися до списку</button>
    </div>
  );
};

export default ServiceDetail;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [serviceInfo, setServiceInfo] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/patient/services/${id}`);
        const services = response.data || [];

        if (services.length > 0) {
          setServiceInfo(services[0].service);

          const allDoctors = services.flatMap((item) => item.doctor);
          setDoctors(allDoctors);
        }
      } catch (error) {
        console.error("Помилка при завантажені даних", error);
      }
    };

    fetchDetail();
  }, [id]);

  if (!serviceInfo) return <div>Завантаження детальної інформації...</div>;

  return (
    <div className="analysis-page-detail">
      <div className="analysis-card">
        <h2>Деталі послуги: {serviceInfo.name}</h2>
        <p>
          <strong>Опис:</strong> {serviceInfo.description || "Опис відсутній"}
        </p>
        <p>
          <strong>Ціна:</strong> {serviceInfo.price} грн
        </p>

        <h3>Лікарі, які надають цю послугу</h3>
        {doctors.map((doctor) => (
          <div key={doctor.id}>
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

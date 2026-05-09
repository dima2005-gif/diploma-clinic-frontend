import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const AdminServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/admin/service/${id}/`);
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
      <h2>Послуга</h2>

      <p>
        <strong>ID:</strong> {service.id}
      </p>

      <p>
        <strong>Назва:</strong> {service.name}
      </p>

      <p>
        <strong>Опис:</strong> {service.description}
      </p>

      <p>
        <strong>Вартість:</strong> {service.price} грн
      </p>

      <h3>Посади, які надають послугу</h3>

      {service.positions?.length === 0 ? (
        <p>Посади не вказано</p>
      ) : (
        <ul>
          {service.positions.map((position) => (
            <li key={position.id}>{position.name}</li>
          ))}
        </ul>
      )}

      <h3>Лікарі, які можуть надати послугу</h3>

      {service.doctors?.length === 0 ? (
        <p>Лікарів не знайдено</p>
      ) : (
        <ul>
          {service.doctors.map((doctor) => (
            <li key={doctor.id}>
              {doctor.full_name} — {doctor.position}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => navigate(`/administrator/services/${service.id}/edit/`)}
      >
        Редагувати
      </button>

      <button onClick={() => navigate("/administrator/services/")}>
        Назад
      </button>
    </div>
  );
};

export default AdminServiceDetail;

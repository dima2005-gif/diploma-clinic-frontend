import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./AdminServiceDetail.css";

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
        toast.error("Не вдалося завантажити послугу");
      }
    };

    fetchService();
  }, [id]);

  if (!service) {
    return <Loader text="Завантаження послуги..." />;
  }

  return (
    <main className="admin-service-detail-page">
      <div className="admin-service-detail-topbar">
        <Button
          variant="outline"
          onClick={() => navigate("/administrator/services/")}
        >
          Назад
        </Button>
      </div>

      <Card className="admin-service-detail-hero">
        <div>
          <p className="service-detail-label">Послуга</p>

          <h1>{service.name}</h1>

          <p className="service-detail-subtitle">ID: {service.id}</p>
          <div className="service-inline-price">
            <span>Вартість</span>
            <strong>{Number(service.price)} грн</strong>
          </div>
        </div>
      </Card>

      <div className="admin-service-detail-grid">
        <Card className="admin-service-info-card">
          <h3>Опис послуги</h3>

          <p>{service.description || "Опис послуги відсутній."}</p>
        </Card>

        <Card className="admin-service-info-card">
          <h3>Посади</h3>

          {service.positions?.length === 0 ? (
            <p className="empty-text">Посади не вказано.</p>
          ) : (
            <div className="service-tags">
              {service.positions?.map((position) => (
                <span key={position.id}>{position.name}</span>
              ))}
            </div>
          )}
        </Card>
      </div>

      <section className="admin-service-doctors-section">
        <div className="section-heading">
          <h2>Лікарі, які можуть надати послугу</h2>
          <p>Працівники, посади яких пов’язані з цією медичною послугою.</p>
        </div>

        {service.doctors?.length === 0 ? (
          <Card>
            <p className="empty-text">Лікарів не знайдено.</p>
          </Card>
        ) : (
          <div className="admin-service-doctors-grid">
            {service.doctors?.map((doctor) => (
              <Card key={doctor.id} className="admin-service-doctor-card">
                <h3>{doctor.full_name}</h3>

                <div>
                  <span>Посада</span>
                  <strong>{doctor.position}</strong>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <div className="admin-service-detail-actions">
        <Button
          variant="info"
          onClick={() =>
            navigate(`/administrator/services/${service.id}/edit/`)
          }
        >
          Редагувати
        </Button>
      </div>
    </main>
  );
};

export default AdminServiceDetail;

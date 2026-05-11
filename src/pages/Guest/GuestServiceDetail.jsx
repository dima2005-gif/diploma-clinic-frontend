import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./GuestServiceDetail.css";

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

  if (!service) {
    return <Loader text="Завантаження послуги..." />;
  }

  return (
    <main className="guest-service-page">
      <div className="detail-topbar">
        <Button variant="outline" onClick={() => navigate("/")}>
          Назад
        </Button>
      </div>

      <div className="service-detail-layout">
        <Card className="service-info-card">
          <p className="service-label">Послуга</p>

          <h1>{service.name}</h1>

          <p className="service-description">{service.description}</p>

          <div className="service-price-block">
            <span>Вартість</span>
            <strong>{service.price} грн</strong>
          </div>
        </Card>

        <section className="service-doctors-section">
          <div className="section-heading">
            <h2>Хто надає послугу</h2>
            <p>Лікарі, які виконують цю медичну послугу.</p>
          </div>

          {service.doctors.length === 0 ? (
            <Card>
              <p className="empty-text">
                Лікарів для цієї послуги не знайдено.
              </p>
            </Card>
          ) : (
            <div className="service-doctors-grid">
              {service.doctors.map((doctor) => (
                <Card key={doctor.id} className="service-doctor-card">
                  <div>
                    <h3>{doctor.full_name}</h3>
                    <p className="doctor-position">{doctor.position}</p>

                    <div className="doctor-schedule-block">
                      <h4>Розклад</h4>

                      {doctor.schedule.length === 0 ? (
                        <p className="empty-text">Розклад ще не вказано.</p>
                      ) : (
                        <div className="doctor-schedule-list">
                          {doctor.schedule.map((item, index) => (
                            <div className="doctor-schedule-row" key={index}>
                              <span>{item.day_of_week}</span>
                              <strong>
                                {item.start_time.slice(0, 5)} —{" "}
                                {item.end_time.slice(0, 5)}
                              </strong>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-footer center">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/doctors/${doctor.id}/`)}
                    >
                      Перейти до лікаря
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default GuestServiceDetail;

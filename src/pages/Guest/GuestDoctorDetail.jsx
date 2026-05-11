import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import RatingStars from "../../components/UI/RatingStars";
import Loader from "../../components/UI/Loader";

import "./GuestDoctorDetail.css";

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

  if (!doctor) {
    return <Loader text="Завантаження лікаря..." />;
  }

  return (
    <main className="guest-detail-page">
      <div className="detail-topbar">
        <Button variant="outline" onClick={() => navigate("/")}>
          Назад
        </Button>
      </div>

      <div className="doctor-detail-layout">
        <Card className="doctor-info-card">
          <div>
            <p className="doctor-label">Лікар</p>
            <h1>{doctor.full_name}</h1>
            <p className="doctor-position-detail">{doctor.position}</p>

            <div className="doctor-rating">
              <RatingStars rating={doctor.average_rating} />
            </div>
          </div>
        </Card>
        <div className="doctor-main-content">
          <section className="detail-section">
            <div className="section-heading">
              <h2>Послуги</h2>
              <p>Послуги, які надає цей лікар.</p>
            </div>

            {doctor.services.length === 0 ? (
              <Card>
                <p className="empty-text">Послуги не знайдено.</p>
              </Card>
            ) : (
              <div className="doctor-services-grid">
                {doctor.services.map((service) => (
                  <Card key={service.id} className="doctor-service-card">
                    <h3>{service.name}</h3>
                    <p className="price">{service.price} грн</p>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="detail-section">
            <div className="section-heading">
              <h2>Розклад</h2>
              <p>Дні та години прийому лікаря.</p>
            </div>

            {doctor.schedule.length === 0 ? (
              <Card>
                <p className="empty-text">Розклад ще не вказано.</p>
              </Card>
            ) : (
              <Card>
                <div className="schedule-list">
                  {doctor.schedule.map((item, index) => (
                    <div className="schedule-row" key={index}>
                      <span>{item.day_of_week}</span>
                      <strong>
                        {item.start_time.slice(0, 5)} —{" "}
                        {item.end_time.slice(0, 5)}
                      </strong>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </section>
        </div>
      </div>

      <section className="reviews-section">
        <div className="section-heading">
          <h2>Відгуки</h2>
          <p>Оцінки та коментарі пацієнтів.</p>
        </div>

        {doctor.reviews.length === 0 ? (
          <Card>
            <p className="empty-text">Відгуків ще немає.</p>
          </Card>
        ) : (
          <div className="reviews-grid">
            {doctor.reviews.map((review) => (
              <Card key={review.id} className="review-card">
                <div className="review-header">
                  <div>
                    <h3>{review.patient}</h3>
                    <p>{review.service}</p>
                  </div>

                  <RatingStars rating={review.rating} />
                </div>

                <p className="review-comment">{review.comment}</p>

                <p className="review-date">
                  {new Date(review.date_created).toLocaleDateString("uk-UA")}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default GuestDoctorDetail;

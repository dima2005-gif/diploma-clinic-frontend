import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import RatingStars from "../../components/UI/RatingStars";

import logo from "../../assets/logo-full.svg";

import "./GuestHome.css";

const GuestHome = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResponse = await api.get("/guest/services/");
        const doctorsResponse = await api.get("/guest/doctors/");

        setServices(servicesResponse.data);
        setDoctors(doctorsResponse.data);
      } catch (error) {
        console.error("Помилка при завантаженні гостьової сторінки", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="guest-page">
      <header className="guest-header">
        <img src={logo} alt="eKarta" className="guest-logo" />

        <nav className="guest-tabs">
          <button
            className={activeTab === "services" ? "tab active" : "tab"}
            onClick={() => setActiveTab("services")}
          >
            Послуги
          </button>

          <button
            className={activeTab === "doctors" ? "tab active" : "tab"}
            onClick={() => setActiveTab("doctors")}
          >
            Лікарі
          </button>
        </nav>

        <div className="guest-header-actions">
          <Button variant="primary" onClick={() => navigate("/login/")}>
            Увійти
          </Button>
        </div>
      </header>

      <section className="guest-hero">
        <h1>Медичні послуги та лікарі в одному місці</h1>
        <p>
          Переглядайте доступні послуги, інформацію про лікарів, розклад роботи
          та відгуки пацієнтів.
        </p>
      </section>

      {activeTab === "services" && (
        <section className="guest-section">
          <div className="section-heading">
            <h2>Наші послуги</h2>
            <p>Оберіть послугу, щоб переглянути деталі та лікарів.</p>
          </div>

          <div className="guest-grid">
            {services.map((service) => (
              <Card key={service.id} className="guest-card">
                <div>
                  <h3>{service.name}</h3>
                  <p className="card-description">{service.description}</p>
                </div>

                <div className="card-footer">
                  <span className="price">{service.price} грн</span>

                  <Button
                    variant="outline"
                    onClick={() => navigate(`/services/${service.id}/`)}
                  >
                    Детальніше
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {activeTab === "doctors" && (
        <section className="guest-section">
          <div className="section-heading">
            <h2>Наші лікарі</h2>
            <p>Перегляньте спеціалістів, їхній рейтинг та доступні послуги.</p>
          </div>

          <div className="guest-grid">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="guest-card doctor-card">
                <div className="doctor-card-content">
                  <h3>{doctor.full_name}</h3>
                  <p className="doctor-position">{doctor.position}</p>
                  <RatingStars rating={doctor.average_rating} />
                </div>

                <div className="card-footer center">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/doctors/${doctor.id}/`)}
                  >
                    Детальніше
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default GuestHome;

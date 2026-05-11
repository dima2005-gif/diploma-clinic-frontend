import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { logoutUser } from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import DoctorLayout from "../../components/layouts/DoctorLayout";

import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/doctor/");
        setStats(response.data);
      } catch (error) {
        console.error("Помилка при завантажені", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <Loader text="Завантаження кабінету лікаря..." />;
  }

  return (
    <DoctorLayout
      doctorName={stats.name}
      position={stats.position}
      stats={stats}
      onLogout={logoutUser}
    >
      <section className="doctor-hero">
        <div>
          <h1>Вітаємо, {stats.name}</h1>
          <p>
            Тут відображається основна інформація про прийоми, записи та робочі
            процеси лікаря.
          </p>
        </div>
      </section>

      <section className="doctor-section">
        <div className="section-heading">
          <h2>Найближчий прийом</h2>
          <p>Наступний запланований візит пацієнта.</p>
        </div>

        <Card className="next-visit-card">
          {stats.next_visit?.time ? (
            <>
              <div>
                <span>Час прийому</span>
                <strong>{stats.next_visit.time}</strong>
              </div>

              <div>
                <span>Пацієнт</span>
                <strong>{stats.next_visit.patient}</strong>
              </div>
            </>
          ) : (
            <p className="empty-text">Найближчих прийомів немає.</p>
          )}
        </Card>
      </section>

      <section className="doctor-section">
        <div className="section-heading">
          <h2>Робочі розділи</h2>
          <p>Перейдіть до потрібного робочого розділу.</p>
        </div>

        <div className="doctor-actions-grid">
          <Card className="doctor-action-card blue">
            <h3>Візити</h3>
            <p>Перегляд записів пацієнтів, підтвердження або відмова.</p>

            <Button variant="info" onClick={() => navigate("/doctor/visit/")}>
              Перейти
            </Button>
          </Card>
        </div>
      </section>
    </DoctorLayout>
  );
};

export default DoctorDashboard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { logoutUser } from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import LaborantLayout from "../../components/layouts/LaborantLayout";

import "./LaborantDashboard.css";

const LaborantDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/laborant/");
        setStats(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <Loader text="Завантаження кабінету лаборанта..." />;
  }

  return (
    <LaborantLayout
      laborantName={stats.name}
      position={stats.position || "Лаборант"}
      stats={stats}
      onLogout={logoutUser}
    >
      <section className="laborant-hero">
        <h1>Вітаємо, {stats.name}</h1>
        <p>
          Робочий кабінет лаборанта для перегляду призначених аналізів,
          завантаження результатів та контролю виконання досліджень.
        </p>
      </section>

      <section className="laborant-section">
        <div className="section-heading">
          <h2>Найближчий аналіз</h2>
          <p>Наступне лабораторне дослідження у вашому розкладі.</p>
        </div>

        <Card className="next-analysis-card">
          {stats.next_analysis?.time ? (
            <>
              <div>
                <span>Час</span>
                <strong>{stats.next_analysis.time}</strong>
              </div>

              <div>
                <span>Пацієнт</span>
                <strong>{stats.next_analysis.patient}</strong>
              </div>

              <div>
                <span>Аналіз</span>
                <strong>{stats.next_analysis.analysis}</strong>
              </div>
            </>
          ) : (
            <p className="empty-text">Найближчих аналізів немає.</p>
          )}
        </Card>
      </section>

      <section className="laborant-section">
        <div className="section-heading">
          <h2>Робочі розділи</h2>
          <p>Перейдіть до списку призначених аналізів.</p>
        </div>

        <div className="laborant-actions-grid">
          <Card className="laborant-action-card blue">
            <h3>Аналізи</h3>
            <p>
              Перегляд призначених аналізів, завантаження результатів та
              підтвердження виконання.
            </p>

            <Button
              variant="info"
              onClick={() => navigate("/laborant/analyses/")}
            >
              Перейти
            </Button>
          </Card>
        </div>
      </section>
    </LaborantLayout>
  );
};

export default LaborantDashboard;

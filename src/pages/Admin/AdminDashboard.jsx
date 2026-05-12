import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { logoutUser } from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/dashboard/");
        setStats(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні адмін-панелі", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <Loader text="Завантаження адмін-панелі..." />;
  }

  const adminSections = [
    {
      title: "Співробітники",
      description:
        "Керування працівниками поліклініки: лікарями, лаборантами та реєстраторами.",
      color: "blue",
      path: "/administrator/employees/",
    },
    {
      title: "Послуги",
      description:
        "Керування довідником медичних послуг, які доступні для запису пацієнтів.",
      color: "green",
      path: "/administrator/services/",
    },
    {
      title: "Аналізи",
      description: "Керування довідником лабораторних аналізів та досліджень.",
      color: "yellow",
      path: "/administrator/analyses/",
    },
    {
      title: "Статистика",
      description:
        "Перегляд статистичних даних роботи системи та активності користувачів.",
      color: "aqua",
      path: "/administrator/statistics/",
    },
    {
      title: "Аудит",
      description:
        "Журнал дій користувачів системи для контролю змін та безпеки.",
      color: "red",
      path: "/administrator/audit/",
    },
  ];

  return (
    <main className="admin-page">
      <div className="admin-layout">
        <Card className="admin-info-card">
          <div>
            <p className="admin-label">{stats.position}</p>
            <h1>{stats.name}</h1>
          </div>

          <div className="admin-side-stats">
            <div className="admin-side-stat green">
              <span>Усього</span>
              <strong>{stats.total_employees}</strong>
            </div>

            <div className="admin-side-stat blue">
              <span>Лікарів</span>
              <strong>{stats.doctors_count}</strong>
            </div>

            <div className="admin-side-stat yellow">
              <span>Лаборантів</span>
              <strong>{stats.laborants_count}</strong>
            </div>

            <div className="admin-side-stat aqua">
              <span>Реєстраторів</span>
              <strong>{stats.registrars_count}</strong>
            </div>

            <div className="admin-side-stat red">
              <span>Адмінів</span>
              <strong>{stats.admins_count}</strong>
            </div>
          </div>

          <Button variant="danger" onClick={logoutUser}>
            Вийти
          </Button>
        </Card>

        <div className="admin-content">
          <section className="admin-hero">
            <h1>Керування системою</h1>
            <p>
              Оберіть потрібний розділ для адміністрування працівників,
              довідників, статистики або журналу дій.
            </p>
          </section>

          <section className="admin-section">
            <div className="section-heading">
              <h2>Розділи адміністратора</h2>
              <p>Основні інструменти керування системою.</p>
            </div>

            <div className="admin-actions-grid">
              {adminSections.map((section) => (
                <Card
                  key={section.title}
                  className={`admin-action-card ${section.color}`}
                >
                  <div>
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>

                  <Button variant="info" onClick={() => navigate(section.path)}>
                    Відкрити
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;

import { useNavigate } from "react-router-dom";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";

import "./StatisticsDashboard.css";

const AdminStatistics = () => {
  const navigate = useNavigate();

  const statistics = [
    {
      title: "Відвідування лікарів",
      description: "Перегляд кількості записів та навантаження на лікарів.",
      color: "blue",
      path: "/administrator/statistics/doctor-visits/",
    },
    {
      title: "Попит послуг",
      description: "Статистика медичних послуг який мають попит.",
      color: "green",
      path: "/administrator/statistics/service-popularity/",
    },
    {
      title: "Кількість аналізів",
      description: "Аналітика призначених лабораторних досліджень.",
      color: "yellow",
      path: "/administrator/statistics/analysis-popularity/",
    },
    {
      title: "Статистика захворюваності",
      description: "Перегляд найбільш поширених діагнозів та захворювань.",
      color: "red",
      path: "/administrator/statistics/diagnoses/",
    },
  ];

  return (
    <main className="admin-statistics-page">
      <div className="admin-statistics-topbar">
        <Button variant="outline" onClick={() => navigate("/administrator/")}>
          Назад
        </Button>
      </div>

      <Card className="admin-statistics-heading">
        <h1>Статистика</h1>

        <p className="dashboard-section-description">
          Перегляд статистики медичних послуг, записів пацієнтів, лабораторних
          досліджень та захворюваності.
        </p>
      </Card>

      <section className="admin-statistics-section">
        <div className="section-heading">
          <h2>Розділи статистики</h2>
          <p>Оберіть потрібний напрямок для перегляду аналітики.</p>
        </div>

        <div className="admin-statistics-grid">
          {statistics.map((item) => (
            <Card
              key={item.title}
              className={`admin-statistics-card ${item.color}`}
            >
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <Button variant="info" onClick={() => navigate(item.path)}>
                Переглянути
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AdminStatistics;

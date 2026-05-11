import { useEffect, useState } from "react";
import api, { logoutUser } from "../../api/axios";
import { useNavigate } from "react-router-dom";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import PatientLayout from "../../components/layouts/PatientLayout";

import "./PatientDashboard.css";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await api.get("/patient/");
        setPatientData(response.data);
      } catch (error) {
        console.error(
          "Помилка при завантаженні даних пацієнта",
          error.response?.data,
        );
      }
    };

    fetchPatientData();
  }, []);

  const getBMICategory = (bmi) => {
    if (!bmi) return "Не вказано";
    if (bmi < 18.5) return "Дефіцит маси тіла";
    if (bmi < 25) return "Нормальна вага";
    if (bmi < 30) return "Надлишкова вага";
    return "Ожиріння";
  };

  if (!patientData) {
    return <Loader text="Завантаження даних пацієнта..." />;
  }

  return (
    <PatientLayout patientData={patientData} onLogout={logoutUser}>
      <section className="patient-hero">
        <h2>Вітаємо, {patientData.first_name}</h2>
        <p>
          Тут ви можете переглядати доступні послуги, аналізи, історію хвороб,
          візити та залишати відгуки.
        </p>
      </section>

      <section className="patient-section">
        <div className="section-heading">
          <h2>Медичні показники</h2>
          <p>Основна інформація про стан пацієнта.</p>
        </div>

        <div className="patient-stats-grid">
          <Card className="patient-stat-card">
            <span>Вага</span>
            <strong>{patientData.weight} кг</strong>
          </Card>

          <Card className="patient-stat-card">
            <span>Зріст</span>
            <strong>{patientData.height} см</strong>
          </Card>

          <Card className="patient-stat-card">
            <span>ІМТ</span>
            <strong>{patientData.bmi}</strong>
            <p>{getBMICategory(patientData.bmi)}</p>
          </Card>

          <Card className="patient-stat-card">
            <span>Група крові</span>
            <strong>{patientData.blood_group}</strong>
          </Card>
        </div>
      </section>

      <section className="patient-section">
        <div className="section-heading">
          <h2>Швидкі дії</h2>
          <p>Оберіть потрібний розділ особистого кабінету.</p>
        </div>

        <div className="patient-actions-grid">
          <Card className="patient-action-card blue">
            <h3>Послуги</h3>
            <p>Перегляд доступних медичних послуг.</p>
            <Button
              variant="outline"
              onClick={() => navigate("/patient/services")}
            >
              Перейти
            </Button>
          </Card>

          <Card className="patient-action-card yellow">
            <h3>Аналізи</h3>
            <p>Перегляд призначених аналізів та результатів.</p>
            <Button
              variant="outline"
              onClick={() => navigate("/patient/analysis")}
            >
              Перейти
            </Button>
          </Card>

          <Card className="patient-action-card green">
            <h3>Історія хвороб</h3>
            <p>Перегляд медичної історії та призначень.</p>
            <Button
              variant="outline"
              onClick={() => navigate("/patient/medical-history")}
            >
              Перейти
            </Button>
          </Card>

          <Card className="patient-action-card red">
            <h3>Візити</h3>
            <p>Перегляд запланованих та минулих візитів.</p>
            <Button
              variant="outline"
              onClick={() => navigate("/patient/visit")}
            >
              Перейти
            </Button>
          </Card>

          <Card className="patient-action-card aqua">
            <h3>Відгуки</h3>
            <p>Перегляд та створення відгуків про послуги.</p>
            <Button
              variant="outline"
              onClick={() => navigate("/patient/responses")}
            >
              Перейти
            </Button>
          </Card>
        </div>
      </section>
    </PatientLayout>
  );
};

export default PatientDashboard;

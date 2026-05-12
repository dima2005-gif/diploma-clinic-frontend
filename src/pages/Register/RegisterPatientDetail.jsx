import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./RegisterPatientDetail.css";

const RegisterPatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/register/${id}/`);
        setPatient(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні пацієнта", error);
      }
    };

    fetchPatient();
  }, [id]);

  if (!patient) {
    return <Loader text="Завантаження пацієнта..." />;
  }

  const isFemale = patient.sex === "Жінка";

  return (
    <main className="register-detail-page">
      <div className="register-detail-topbar">
        <Button variant="outline" onClick={() => navigate("/register/")}>
          Назад
        </Button>
      </div>

      <Card className="register-detail-hero">
        <div>
          <p className="register-detail-label">Картка пацієнта</p>

          <h1>
            {patient.last_name} {patient.first_name} {patient.middle_name}
          </h1>

          <p className="register-detail-subtitle">
            Логін: {patient.login} • ID: {patient.id}
          </p>
        </div>

        <span
          className={
            isFemale ? "patient-sex-badge female" : "patient-sex-badge male"
          }
        >
          {" "}
          {patient.sex}
        </span>
      </Card>

      <div className="register-detail-grid">
        <Card className="register-detail-card">
          <h3>Особисті дані</h3>

          <div className="register-info-list">
            <div>
              <span>Дата народження</span>
              <strong>
                {new Date(patient.date_of_birth).toLocaleDateString("uk-UA")}
              </strong>
            </div>

            <div>
              <span>Вік</span>
              <strong>{patient.age}</strong>
            </div>

            <div>
              <span>Адреса</span>
              <strong>{patient.address || "Не вказано"}</strong>
            </div>
          </div>
        </Card>

        <Card className="register-detail-card">
          <h3>Контакти</h3>

          <div className="register-info-list">
            <div>
              <span>Телефон</span>
              <strong>{patient.phone_number || "Не вказано"}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{patient.email || "Не вказано"}</strong>
            </div>
          </div>
        </Card>

        <Card className="register-detail-card">
          <h3>Медичні дані</h3>

          <div className="register-info-list">
            <div>
              <span>Вага</span>
              <strong>{patient.weight} кг</strong>
            </div>

            <div>
              <span>Зріст</span>
              <strong>{patient.height} см</strong>
            </div>

            <div>
              <span>Група крові</span>
              <strong>{patient.blood_group || "Не вказано"}</strong>
            </div>
            <div>
              <span>BMI</span>
              <strong>{patient.bmi || "—"}</strong>
            </div>
          </div>
        </Card>
      </div>

      <div className="register-detail-actions">
        <Button
          variant="info"
          onClick={() => navigate(`/register/${patient.id}/edit/`)}
        >
          Редагувати
        </Button>
      </div>
    </main>
  );
};

export default RegisterPatientDetail;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { logoutUser } from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import RegisterLayout from "../../components/layouts/RegisterLayout";

import "./RegisterPatientList.css";

const RegisterPatientsList = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registerData, setRegisterData] = useState(null);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const [registerResponse, patientsResponse] = await Promise.all([
          api.get("/register/dashboard/"),
          api.get("/register/"),
        ]);

        setRegisterData(registerResponse.data);
        setPatients(patientsResponse.data || []);
      } catch (error) {
        console.error("Помилка при завантаженні пацієнтів", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading || !registerData) {
    return <Loader text="Завантаження пацієнтів..." />;
  }

  return (
    <RegisterLayout
      registerName={registerData.name}
      position={registerData.position}
      stats={registerData}
      onLogout={logoutUser}
    >
      {" "}
      <section className="register-patients-hero">
        <div>
          <h1>Список пацієнтів</h1>
          <p>
            Переглядайте зареєстрованих пацієнтів та додавайте нові картки до
            системи.
          </p>
        </div>

        <Button variant="info" onClick={() => navigate("/register/create/")}>
          Додати пацієнта
        </Button>
      </section>
      <section className="register-patients-section">
        <div className="section-heading">
          <h2>Пацієнти</h2>
          <p>Загальна кількість: {patients.length}</p>
        </div>

        {patients.length === 0 ? (
          <Card>
            <p className="empty-text">Пацієнтів не знайдено.</p>
          </Card>
        ) : (
          <div className="register-patients-grid">
            {patients.map((patient) => (
              <Card key={patient.id} className="register-patient-card">
                <div>
                  <div className="register-patient-header">
                    <h3>
                      {patient.last_name} {patient.first_name}{" "}
                      {patient.middle_name || " "}
                    </h3>

                    <span
                      className={
                        patient.sex === "Жінка"
                          ? "patient-sex-badge female"
                          : "patient-sex-badge male"
                      }
                    >
                      {patient.sex}
                    </span>
                  </div>

                  <div className="register-patient-meta">
                    <div>
                      <span>По батькові</span>
                      <strong>{patient.middle_name || "Не вказано"}</strong>
                    </div>

                    {patient.date_of_birth && (
                      <div>
                        <span>Дата народження</span>
                        <strong>
                          {new Date(patient.date_of_birth).toLocaleDateString(
                            "uk-UA",
                          )}
                        </strong>
                      </div>
                    )}

                    {patient.phone_number && (
                      <div>
                        <span>Телефон</span>
                        <strong>{patient.phone_number}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="register-patient-actions">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/register/${patient.id}/`)}
                  >
                    Деталі
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </RegisterLayout>
  );
};

export default RegisterPatientsList;

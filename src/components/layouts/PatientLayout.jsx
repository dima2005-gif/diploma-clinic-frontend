import Button from "../UI/Button";
import Card from "../UI/Card";

import "./PatientLayout.css";

const PatientLayout = ({ patientData, children, onLogout }) => {
  const patientFullName = `${patientData.last_name} ${patientData.first_name} ${patientData.middle_name}`;

  return (
    <main className="patient-page">
      <div className="patient-layout">
        <Card className="patient-info-card">
          <div>
            <p className="patient-label">Пацієнт</p>

            <h1>{patientFullName}</h1>

            <div className="patient-main-info">
              <p>{patientData.age} років</p>
              <p>{patientData.sex}</p>
              <p>{patientData.blood_group}</p>
            </div>
          </div>

          <div className="patient-contact-list">
            <div>
              <span>Телефон</span>
              <strong>{patientData.phone_number}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{patientData.email}</strong>
            </div>

            <div>
              <span>Адреса</span>
              <strong>{patientData.address}</strong>
            </div>
          </div>

          {onLogout && (
            <Button variant="danger" onClick={onLogout}>
              Вийти
            </Button>
          )}
        </Card>

        <div className="patient-content">{children}</div>
      </div>
    </main>
  );
};

export default PatientLayout;

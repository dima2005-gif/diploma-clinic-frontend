import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import PatientLayout from "../../components/layouts/PatientLayout";

import "./ServicesDashboard.css";

const DirectoryOfServices = () => {
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState(null);
  const [services, setServices] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientResponse = await api.get("/patient/");
        const servicesResponse = await api.get("/patient/services/");

        setPatientData(patientResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error("Помилка при завантажені послуг", error);
      }
    };

    fetchData();
  }, []);

  if (!patientData || !services) {
    return <Loader text="Завантаження послуг..." />;
  }

  return (
    <PatientLayout patientData={patientData}>
      <div className="detail-topbar">
        <Button variant="outline" onClick={() => navigate("/patient")}>
          Назад
        </Button>
      </div>

      <section className="patient-services-hero">
        <h1>Довідник послуг</h1>
        <p>Перегляньте доступні медичні послуги, їх опис та вартість.</p>
      </section>

      {services.length === 0 ? (
        <Card>
          <p className="empty-text">Послуги не знайдено.</p>
        </Card>
      ) : (
        <div className="patient-services-grid">
          {services.map((service) => (
            <Card key={service.id} className="patient-service-card">
              <div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>

              <div className="service-card-footer">
                <span>{service.price} грн</span>

                <Button
                  variant="outline"
                  onClick={() => navigate(`/patient/services/${service.id}`)}
                >
                  Детально
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PatientLayout>
  );
};

export default DirectoryOfServices;

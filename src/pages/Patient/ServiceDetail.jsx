import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import PatientLayout from "../../components/layouts/PatientLayout";

import "./ServiceDetail.css";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [patientData, setPatientData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [serviceInfo, setServiceInfo] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const patientResponse = await api.get("/patient/");
        const serviceResponse = await api.get(`/patient/services/${id}`);

        const services = serviceResponse.data || [];

        setPatientData(patientResponse.data);

        if (services.length > 0) {
          setServiceInfo(services[0].service);

          const allDoctors = services.flatMap((item) => item.doctor);
          setDoctors(allDoctors);
        }
      } catch (error) {
        console.error("Помилка при завантажені даних", error);
      }
    };

    fetchDetail();
  }, [id]);

  if (!patientData || !serviceInfo) {
    return <Loader text="Завантаження детальної інформації..." />;
  }

  return (
    <PatientLayout patientData={patientData}>
      <div className="detail-topbar">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>

      <Card className="patient-service-detail-card">
        <p className="service-label">Послуга</p>

        <h1>{serviceInfo.name}</h1>

        <p className="service-description">
          {serviceInfo.description || "Опис відсутній"}
        </p>

        <div className="service-price-block">
          <span>Вартість</span>
          <strong>{serviceInfo.price} грн</strong>
        </div>
      </Card>

      <section className="patient-service-doctors-section">
        <div className="section-heading">
          <h2>Лікарі, які надають цю послугу</h2>
          <p>Оберіть лікаря та перегляньте його графік роботи.</p>
        </div>

        {doctors.length === 0 ? (
          <Card>
            <p className="empty-text">Лікарів для цієї послуги не знайдено.</p>
          </Card>
        ) : (
          <div className="patient-service-doctors-grid">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="patient-service-doctor-card">
                <div>
                  <h3>
                    {doctor.last_name} {doctor.first_name} {doctor.middle_name}
                  </h3>

                  <p className="doctor-position">
                    {doctor.position?.name || doctor.position}
                  </p>

                  <div className="doctor-schedule-block">
                    <h4>Розклад</h4>

                    {doctor.schedule.length > 0 ? (
                      <div className="doctor-schedule-list">
                        {doctor.schedule.map((item, index) => (
                          <div className="doctor-schedule-row" key={index}>
                            <span>{item.day_of_week}</span>
                            <strong>
                              {item.start_time.slice(0, 5)} —{" "}
                              {item.end_time.slice(0, 5)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="empty-text">Розклад ще не вказано.</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </PatientLayout>
  );
};

export default ServiceDetail;

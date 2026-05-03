import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DiagnosisTab from "../../components/doctor/diagnosis/DiagnosisTab";
import MedicinesTab from "../../components/doctor/medicines/MedicinesTab";
import AnalysisTab from "../../components/doctor/analysis/AnalysisTab";
import api from "../../api/axios";

const DoctorVisitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState();
  const [activeTab, setActiveTab] = useState("patient");

  const fetchVisit = async () => {
    try {
      const response = await api.get(`/doctor/visit/${id}/`);
      setVisit(response.data);
    } catch (error) {
      console.error("Помилка при завантажені", error);
    }
  };
  useEffect(() => {
    fetchVisit();
  }, [id]);
  const handleCloseHistory = async () => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете закрити історію хвороби?",
    );

    if (!confirmed) return;

    try {
      await api.patch(`/doctor/visit/${visit.id}/close-history/`);
      await fetchVisit();
    } catch (error) {
      console.error("Помилка при закритті історії хвороби", error);
    }
  };
  if (!visit) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Прийом</h2>

      <div>
        <h3>Пацієнт</h3>
        <p>
          {visit.patient.last_name} {visit.patient.first_name}{" "}
          {visit.patient.middle_name}
        </p>
        <p>Дата народження: {visit.patient.date_of_birth}</p>
        <p>Стать: {visit.patient.sex}</p>
        <p>Номер телефону: {visit.patient.phone_number}</p>
        <p>Електрона пошта: {visit.patient.email}</p>
        <p>Вага: {visit.patient.weight} кг</p>
        <p>Зріст: {visit.patient.height} см</p>
        <p>Група крові: {visit.patient.blood_group}</p>
      </div>

      <div>
        <h3>Послуга</h3>
        <p>{visit.service_name}</p>
        <p>{new Date(visit.date_prescribed).toLocaleString("uk-UA")}</p>
        <p>Статус: {visit.status}</p>
        <button
          onClick={() =>
            navigate(`/doctor/visit/${id}/medical-history/${visit.patient.id}`)
          }
        >
          Переглянути історію хвороби
        </button>
        {visit.history && !visit.history.date_departure && (
          <button onClick={handleCloseHistory}>Закрити історію хвороби</button>
        )}

        {visit.history?.date_departure && (
          <p>Історію закрито: {visit.history.date_departure}</p>
        )}
      </div>

      <div>
        <button onClick={() => setActiveTab("diagnosis")}>Діагноз</button>
        <button onClick={() => setActiveTab("medicines")}>Ліки</button>
        <button onClick={() => setActiveTab("analysis")}>Аналізи</button>
      </div>

      {activeTab === "diagnosis" && (
        <DiagnosisTab visit={visit} refresh={fetchVisit} />
      )}
      {activeTab === "medicines" && (
        <MedicinesTab visit={visit} refresh={fetchVisit} />
      )}

      {activeTab === "analysis" && (
        <AnalysisTab visit={visit} refresh={fetchVisit} />
      )}

      <button onClick={() => navigate("/doctor/visit/")}>Назад</button>
    </div>
  );
};

export default DoctorVisitDetail;

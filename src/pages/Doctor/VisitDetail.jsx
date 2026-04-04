import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const DoctorVisitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState();
  const [activeTab, setActiveTab] = useState("patient");

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const response = await api.get(`/doctor/visit/${id}/`);
        setVisit(response.data);
      } catch (error) {
        console.error("Помилка при завантажені", error);
      }
    };
    fetchVisit();
  }, [id]);

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
      </div>

      <div>
        <button onClick={() => setActiveTab("diagnosis")}>Діагноз</button>
        <button onClick={() => setActiveTab("medicines")}>Ліки</button>
        <button onClick={() => setActiveTab("analysis")}>Аналізи</button>
      </div>

      {activeTab === "diagnosis" && (
        <div>
          <h3>Діагноз</h3>
          {visit.has_medical_history ? (
            <p>Висновок є</p>
          ) : (
            <p>Висновок ще не створено</p>
          )}
        </div>
      )}

      {activeTab === "medicines" && (
        <div>
          <h3>Ліки</h3>
          <p>Список ліків буде тут</p>
        </div>
      )}

      {activeTab === "analysis" && (
        <div>
          <h3>Аналізи</h3>
          <p>Список аналізів буде тут</p>
        </div>
      )}

      <button onClick={() => navigate("/doctor/visit/")}>Назад</button>
    </div>
  );
};

export default DoctorVisitDetail;

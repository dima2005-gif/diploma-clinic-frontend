import { useEffect, useState } from "react";
import api, { logoutUser } from "../../api/axios";
import { useNavigate } from "react-router-dom";

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
    if (!bmi) return "";
    if (bmi < 18.5) return "Дефіцит маси тіла";
    if (bmi < 25) return "Нормальна вага";
    if (bmi < 30) return "Надлишкова вага";
    return "Ожиріння";
  };

  if (!patientData) {
    return <div>Завантаження даних пацієнта...</div>;
  }
  return (
    <div className="patient-dashboard">
      <h1>Вітаємо {patientData.first_name}</h1>
      <p>Ваші дані:</p>
      <ul>
        <li>Ім'я: {patientData.first_name}</li>
        <li>Прізвище: {patientData.last_name}</li>
        <li>По батькові: {patientData.middle_name}</li>
        <li>Вік: {patientData.age}</li>
        <li>Номер телефону: {patientData.phone_number}</li>
        <li>Email: {patientData.email}</li>
        <li>Адреса проживання: {patientData.address}</li>
        <li>Стать: {patientData.sex}</li>
        <li>Вага: {patientData.weight}</li>
        <li>Зріст: {patientData.height}</li>
        <li>
          ІМТ: {patientData.bmi} {getBMICategory(patientData.bmi)}
        </li>
        <li>Група крові: {patientData.blood_group}</li>
      </ul>
      <button onClick={logoutUser}>Вийти</button>
      <button onClick={() => navigate("/patient/services")}>
        Переглянути послуги
      </button>
      <button onClick={() => navigate("/patient/analysis")}>
        Переглянути аналізи
      </button>
      <button onClick={() => navigate("/patient/medical-history")}>
        Переглянути історію хвороб
      </button>
      <button onClick={() => navigate("/patient/visit")}>Візити</button>
    </div>
  );
};

export default PatientDashboard;

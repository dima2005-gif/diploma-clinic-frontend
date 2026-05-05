import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

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

  if (!patient) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Пацієнт</h2>

      <div>
        <p>
          <strong>ID:</strong> {patient.id}
        </p>

        <p>
          <strong>Логін:</strong> {patient.login}
        </p>

        <p>
          <strong>ПІБ:</strong> {patient.last_name} {patient.first_name}{" "}
          {patient.middle_name}
        </p>

        <p>
          <strong>Дата народження:</strong> {patient.date_of_birth}
        </p>

        <p>
          <strong>Вік:</strong> {patient.age}
        </p>

        <p>
          <strong>Стать:</strong> {patient.sex}
        </p>

        <p>
          <strong>Номер телефону:</strong> {patient.phone_number}
        </p>

        <p>
          <strong>Електронна пошта:</strong> {patient.email}
        </p>

        <p>
          <strong>Адреса:</strong> {patient.address}
        </p>

        <p>
          <strong>Вага:</strong> {patient.weight} кг
        </p>

        <p>
          <strong>Зріст:</strong> {patient.height} см
        </p>

        <p>
          <strong>BMI:</strong> {patient.bmi}
        </p>

        <p>
          <strong>Група крові:</strong> {patient.blood_group}
        </p>
      </div>

      <button onClick={() => navigate(`/register/${patient.id}/edit/`)}>
        Редагувати
      </button>

      <button onClick={() => navigate("/register/")}>Назад</button>
    </div>
  );
};

export default RegisterPatientDetail;

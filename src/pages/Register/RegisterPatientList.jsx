import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const RegisterPatientsList = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get("/register/");
        setPatients(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні пацієнтів", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Список пацієнтів</h2>

      <button onClick={() => navigate("/register/create/")}>
        Додати пацієнта
      </button>

      <table>
        <thead>
          <tr>
            <th>Ім'я</th>
            <th>Прізвище</th>
            <th>По батькові</th>
            <th>Стать</th>
            <th>Дії</th>
          </tr>
        </thead>

        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan="6">Пацієнтів не знайдено.</td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.first_name}</td>
                <td>{patient.last_name}</td>
                <td>{patient.middle_name}</td>
                <td>{patient.sex}</td>
                <td>
                  <button onClick={() => navigate(`/register/${patient.id}/`)}>
                    Деталі
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button onClick={() => navigate("/login/")}>Вийти</button>
    </div>
  );
};

export default RegisterPatientsList;

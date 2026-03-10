import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const VisitsList = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState();

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const response = await api.get(`/patient/visit/`);
        setVisits(response.data);
      } catch (error) {
        console.error("Помилка при завантажені даних", error);
      }
    };
    fetchVisit();
  }, []);

  if (!visits) {
    return <div>Завантажуються список візитів зачекайте...</div>;
  }

  return (
    <div className="visit-page">
      <h2>Візити</h2>
      <table>
        <thead>
          <tr>
            <th>Назва</th>
            <th>Лікар</th>
            <th>Дата запису</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit.id}>
              <td>{visit.service.name}</td>
              <td>
                {visit.doctor.first_name} {visit.doctor.last_name}{" "}
                {visit.doctor.middle_name}
              </td>
              <td>
                {new Date(visit.date_prescribed).toLocaleString("uk" - "UA")}
              </td>
              <td>{visit.status}</td>
              <td>
                <button onClick={() => navigate("#")}>Редагувати</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => navigate("/patient/")}>
        Повернутися до головної сторінки
      </button>
    </div>
  );
};

export default VisitsList;

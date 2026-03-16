import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const VisitsList = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);

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

  const fetchCancel = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете скасувати запис?")) return;
    try {
      await api.patch(`/patient/visit/${id}/cancel/`);
      setVisits(
        visits.map((v) => (v.id === id ? { ...v, status: "Відмовлено" } : v)),
      );
    } catch (error) {
      console.error("Помилка при скасуванні", error);
    }
  };

  const activeVisits = visits.filter((v) => v.status !== "Відмовлено");
  const archivedVisits = visits.filter((v) => v.status === "Відмовлено");

  if (!visits) {
    return <div>Завантажуються список візитів зачекайте...</div>;
  }

  return (
    <div className="visit-page">
      <h2>Візити</h2>
      <button onClick={() => navigate("/patient/visit/create")}>
        Створити запис
      </button>
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
          {activeVisits.map((visit) => (
            <tr key={visit.id}>
              <td>{visit.service.name}</td>
              <td>
                {visit.doctor.first_name} {visit.doctor.last_name}{" "}
                {visit.doctor.middle_name}
              </td>
              <td>{new Date(visit.date_prescribed).toLocaleString("uk-UA")}</td>
              <td>{visit.status}</td>
              <td>
                {visit.status === "Заплановано" && (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/patient/visit/${visit.id}/update`)
                      }
                    >
                      Редагувати
                    </button>
                    <button onClick={() => fetchCancel(visit.id)}>
                      Скасувати
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {archivedVisits.length > 0 && (
        <div className="visit-page">
          <h3>Архів</h3>
          <table>
            <thead>
              <tr>
                <th>Назва</th>
                <th>Лікар</th>
                <th>Дата запису</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {archivedVisits.map((visit) => (
                <tr key={visit.id}>
                  <td>{visit.service.name}</td>
                  <td>
                    {visit.doctor.first_name} {visit.doctor.last_name}{" "}
                    {visit.doctor.middle_name}
                  </td>
                  <td>
                    {new Date(visit.date_prescribed).toLocaleString("uk-UA")}
                  </td>
                  <td>{visit.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={() => navigate("/patient/")}>
        Повернутися до головної сторінки
      </button>
    </div>
  );
};

export default VisitsList;

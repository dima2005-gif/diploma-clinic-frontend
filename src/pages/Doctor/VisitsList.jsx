import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const DoctorVisitsList = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await api.get("/doctor/visit/");
        setVisits(response.data);
      } catch (error) {
        console.error("Помилка при завантажені записів", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  const handleStatusChange = async () => {
    if (!modal) return;
    try {
      await api.patch(`/doctor/visit/${modal.id}/confirm/`, {
        action: modal.action,
      });
      setVisits(
        visits.map((v) =>
          v.id === modal.id
            ? {
              ...v,
              status:
                modal.action === "confirm" ? "Підтверджено" : "Відмовлено",
            }
            : v,
        ),
      );
      setModal(null);
    } catch (error) {
      console.error("Помилка при зміні статусу", error);
    }
  };

  const plannedVisits = visits.filter((v) => v.status === "Заплановано");
  const confirmedVisits = visits.filter((v) => v.status === "Підтверджено");
  const archivedVisits = visits.filter((v) => v.status === "Відмовлено");

  if (loading) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Записи пацієнтів</h2>

      {modal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              minWidth: "300px",
            }}
          >
            <h3>Підтвердження дії</h3>
            <p>
              {modal.action === "confirm"
                ? "Ви впевнені що хочете підтвердити цей запис?"
                : "Ви впевнені що хочете відхилити цей запис?"}
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button onClick={handleStatusChange}>
                {modal.action === "confirm" ? "Підтвердити" : "Відхилити"}
              </button>
              <button onClick={() => setModal(null)}>Скасувати</button>
            </div>
          </div>
        </div>
      )}

      <h3>Заплановані</h3>
      {plannedVisits.length === 0 ? (
        <p>Немає запланованих записів</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Пацієнт</th>
              <th>Послуга</th>
              <th>Дата</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {plannedVisits.map((visit) => (
              <tr key={visit.id}>
                <td>
                  {visit.patient.first_name} {visit.patient.last_name}
                </td>
                <td>{visit.service_name}</td>
                <td>
                  {new Date(visit.date_prescribed).toLocaleString("uk-UA")}
                </td>
                <td>{visit.status}</td>
                <td>
                  <button
                    onClick={() =>
                      setModal({ id: visit.id, action: "confirm" })
                    }
                  >
                    Підтвердити
                  </button>
                  <button
                    onClick={() => setModal({ id: visit.id, action: "reject" })}
                  >
                    Відхилити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Підтверджені</h3>
      {confirmedVisits.length === 0 ? (
        <p>Немає підтверджених записів</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Пацієнт</th>
              <th>Послуга</th>
              <th>Дата</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {confirmedVisits.map((visit) => (
              <tr key={visit.id}>
                <td>
                  {visit.patient.first_name} {visit.patient.last_name}
                </td>
                <td>{visit.service_name}</td>
                <td>
                  {new Date(visit.date_prescribed).toLocaleString("uk-UA")}
                </td>
                <td>{visit.status}</td>
                <td>
                  <button
                    onClick={() => navigate(`/doctor/visit/${visit.id}/`)}
                  >
                    Відкрити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {archivedVisits.length > 0 && (
        <>
          <h3>Архів</h3>
          <table>
            <thead>
              <tr>
                <th>Пацієнт</th>
                <th>Послуга</th>
                <th>Дата</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {archivedVisits.map((visit) => (
                <tr key={visit.id}>
                  <td>
                    {visit.patient.first_name} {visit.patient.last_name}
                  </td>
                  <td>{visit.service_name}</td>
                  <td>
                    {new Date(visit.date_prescribed).toLocaleString("uk-UA")}
                  </td>
                  <td>{visit.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <button onClick={() => navigate("/doctor/")}>Назад</button>
    </div>
  );
};

export default DoctorVisitsList;

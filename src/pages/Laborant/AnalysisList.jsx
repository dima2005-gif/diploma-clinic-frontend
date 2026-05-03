import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const LaborantAnalysisList = () => {
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await api.get("/laborant/analysis/");
        setAnalyses(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні аналізів", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const handleStatusChange = async () => {
    if (!modal) return;

    try {
      await api.patch(`/laborant/analysis/${modal.id}/confirm/`, {
        action: modal.action,
      });

      setAnalyses((prev) =>
        prev.map((item) =>
          item.id === modal.id
            ? {
              ...item,
              status:
                modal.action === "confirm" ? "Підтверджено" : "Відмовлено",
            }
            : item,
        ),
      );

      setModal(null);
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при зміні статусу аналізу";
      console.error("Помилка при зміні статусу аналізу", error);
      alert(message);
    }
  };

  if (loading) return <div>Завантаження...</div>;

  const plannedAnalyses = analyses.filter(
    (item) => item.status === "Заплановано",
  );
  const confirmedAnalyses = analyses.filter(
    (item) => item.status === "Підтверджено",
  );
  const archivedAnalyses = analyses.filter(
    (item) => item.status === "Відмовлено",
  );

  return (
    <div>
      <h2>Список аналізів пацієнтів</h2>

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
                ? "Ви впевнені, що хочете підтвердити цей аналіз?"
                : "Ви впевнені, що хочете відхилити цей аналіз?"}
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

      {plannedAnalyses.length === 0 ? (
        <p>Немає запланованих аналізів</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Пацієнт</th>
              <th>Лікар</th>
              <th>Аналіз</th>
              <th>Дата</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {plannedAnalyses.map((item) => (
              <tr key={item.id}>
                <td>{item.patient.full_name}</td>
                <td>{item.doctor.full_name}</td>
                <td>{item.analysis.name}</td>
                <td>
                  {new Date(item.date_prescribed).toLocaleString("uk-UA")}
                </td>
                <td>{item.status}</td>
                <td>
                  <button
                    onClick={() => setModal({ id: item.id, action: "confirm" })}
                  >
                    Підтвердити
                  </button>

                  <button
                    onClick={() => setModal({ id: item.id, action: "reject" })}
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

      {confirmedAnalyses.length === 0 ? (
        <p>Немає підтверджених аналізів</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Пацієнт</th>
              <th>Лікар</th>
              <th>Аналіз</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Результат</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {confirmedAnalyses.map((item) => (
              <tr key={item.id}>
                <td>{item.patient.full_name}</td>
                <td>{item.doctor.full_name}</td>
                <td>{item.analysis.name}</td>
                <td>
                  {new Date(item.date_prescribed).toLocaleString("uk-UA")}
                </td>
                <td>{item.status}</td>
                <td>
                  {item.result_url ? (
                    <a
                      href={item.result_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Переглянути
                    </a>
                  ) : (
                    "Немає"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/laborant/analyses/${item.id}`)}
                  >
                    Відкрити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {archivedAnalyses.length > 0 && (
        <>
          <h3>Архів</h3>

          <table>
            <thead>
              <tr>
                <th>Пацієнт</th>
                <th>Лікар</th>
                <th>Аналіз</th>
                <th>Дата</th>
                <th>Статус</th>
              </tr>
            </thead>

            <tbody>
              {archivedAnalyses.map((item) => (
                <tr key={item.id}>
                  <td>{item.patient.full_name}</td>
                  <td>{item.doctor.full_name}</td>
                  <td>{item.analysis.name}</td>
                  <td>
                    {new Date(item.date_prescribed).toLocaleString("uk-UA")}
                  </td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <button onClick={() => navigate("/laborant/")}>Назад</button>
    </div>
  );
};

export default LaborantAnalysisList;

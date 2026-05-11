import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import PatientLayout from "../../components/layouts/PatientLayout";

import "./MedicalHistoryDashboard.css";

const MedicalHistory = () => {
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState(null);
  const [history, setHistory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientResponse = await api.get("/patient/");
        const historyResponse = await api.get("/patient/medical-history/");

        setPatientData(patientResponse.data);
        setHistory(historyResponse.data);
      } catch (error) {
        console.error("Помилка при завантажені даних", error);
      }
    };

    fetchData();
  }, []);

  if (!patientData || !history) {
    return <Loader text="Завантаження історій хвороб..." />;
  }

  return (
    <PatientLayout patientData={patientData}>
      <div className="detail-topbar">
        <Button variant="outline" onClick={() => navigate("/patient")}>
          Назад
        </Button>
      </div>

      <section className="history-hero">
        <h1>Історія хвороб</h1>
        <p>
          Переглядайте медичні історії, діагнози, послуги та періоди лікування.
        </p>
      </section>

      {history.length === 0 ? (
        <Card>
          <p className="empty-text">Історій хвороб ще немає.</p>
        </Card>
      ) : (
        <div className="history-grid">
          {history.map((item) => {
            const isClosed = Boolean(item.date_departure);

            return (
              <Card key={item.id} className="history-card">
                <div>
                  <div className="history-card-header">
                    <h3>{item.service}</h3>

                    <span
                      className={
                        isClosed
                          ? "history-status closed"
                          : "history-status open"
                      }
                    >
                      {isClosed ? "Закрита" : "Відкрита"}
                    </span>
                  </div>

                  <div className="history-meta">
                    <div>
                      <span>Дата прибуття</span>
                      <strong>
                        {new Date(item.date_arrival).toLocaleDateString(
                          "uk-UA",
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Дата вибуття</span>
                      <strong>
                        {item.date_departure
                          ? new Date(item.date_departure).toLocaleDateString(
                            "uk-UA",
                          )
                          : "Не вказано"}
                      </strong>
                    </div>

                    <div>
                      <span>Діагноз</span>
                      <strong>{item.diagnosis?.name || "---"}</strong>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/patient/medical-history/${item.id}`)
                  }
                >
                  Детально
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </PatientLayout>
  );
};

export default MedicalHistory;

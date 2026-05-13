import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./MedicalHistoryDashboard.css";

const MedicalHistory = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyResponse = await api.get("/patient/medical-history/");

        setHistory(historyResponse.data);
      } catch (error) {
        console.error("Помилка при завантажені даних", error);
      }
    };

    fetchData();
  }, []);

  if (!history) {
    return <Loader text="Завантаження історій хвороб..." />;
  }
  const filteredHistories =
    selectedStatus === "all"
      ? history
      : history.filter((item) =>
        selectedStatus === "open"
          ? !item.date_departure
          : item.date_departure,
      );
  return (
    <main className="history-page">
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
      <div className="history-filter-tabs">
        <button
          className={selectedStatus === "all" ? "active" : ""}
          onClick={() => setSelectedStatus("all")}
        >
          Усі
        </button>

        <button
          className={selectedStatus === "open" ? "active" : ""}
          onClick={() => setSelectedStatus("open")}
        >
          Відкриті
        </button>

        <button
          className={selectedStatus === "closed" ? "active" : ""}
          onClick={() => setSelectedStatus("closed")}
        >
          Закриті
        </button>
      </div>
      {filteredHistories.length === 0 ? (
        <Card>
          <p className="empty-text">Історій хвороб ще немає.</p>
        </Card>
      ) : (
        <div className="history-grid">
          {filteredHistories.map((item) => {
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
    </main>
  );
};

export default MedicalHistory;

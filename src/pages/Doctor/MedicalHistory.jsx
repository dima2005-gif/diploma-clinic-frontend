import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import Badge from "../../components/UI/Badge";

import "./MedicalHistory.css";

const MedicalHistoryAccordion = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [activeTabs, setActiveTabs] = useState({});

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/doctor/patient/${patientId}/history/`);

        setHistories(response.data.histories || []);
      } catch (error) {
        console.error("Помилка при завантаженні історії", error);
        toast.error("Не вдалося завантажити історію хвороби");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [patientId]);

  const handleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);

    setActiveTabs((prev) => ({
      ...prev,
      [index]: prev[index] || "diagnosis",
    }));
  };

  const handleTabClick = (index, tab) => {
    setActiveTabs((prev) => ({ ...prev, [index]: tab }));
  };

  if (loading) {
    return <Loader text="Завантаження історій..." />;
  }

  return (
    <main className="medical-history-page">
      <div className="medical-history-topbar">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>

      <section className="medical-history-hero">
        <h1>Історія хвороби</h1>
        <p>
          Перегляд попередніх медичних історій пацієнта, діагнозів, ліків та
          призначених аналізів.
        </p>
      </section>

      {histories.length === 0 ? (
        <Card>
          <p className="empty-text">Історія хвороби відсутня.</p>
        </Card>
      ) : (
        <div className="history-accordion">
          {histories.map((history, index) => {
            const isOpen = openIndex === index;
            const activeTab = activeTabs[index] || "diagnosis";
            const isClosed = Boolean(history.date_departure);

            return (
              <Card key={history.id} className="history-accordion-card">
                <button
                  type="button"
                  className="history-accordion-header"
                  onClick={() => handleOpen(index)}
                >
                  <div>
                    <h3>{history.service}</h3>

                    <p>
                      {new Date(history.date_arrival).toLocaleDateString(
                        "uk-UA",
                      )}{" "}
                      —{" "}
                      {history.date_departure
                        ? new Date(history.date_departure).toLocaleDateString(
                          "uk-UA",
                        )
                        : "дотепер"}
                    </p>
                  </div>

                  <span
                    className={
                      isClosed
                        ? "history-state-badge closed"
                        : "history-state-badge open"
                    }
                  >
                    {isClosed ? "Закрита" : "Відкрита"}
                  </span>
                </button>

                {isOpen && (
                  <div className="history-accordion-body">
                    <div className="history-tabs">
                      <button
                        className={
                          activeTab === "diagnosis"
                            ? "history-tab active"
                            : "history-tab"
                        }
                        onClick={() => handleTabClick(index, "diagnosis")}
                      >
                        Діагноз
                      </button>

                      <button
                        className={
                          activeTab === "medicines"
                            ? "history-tab active"
                            : "history-tab"
                        }
                        onClick={() => handleTabClick(index, "medicines")}
                      >
                        Ліки
                      </button>

                      <button
                        className={
                          activeTab === "analysis"
                            ? "history-tab active"
                            : "history-tab"
                        }
                        onClick={() => handleTabClick(index, "analysis")}
                      >
                        Аналізи
                      </button>
                    </div>

                    {activeTab === "diagnosis" && (
                      <div className="history-tab-panel">
                        <div className="history-info-grid">
                          <div>
                            <span>Діагноз</span>
                            <strong>
                              {history.diagnosis?.name || "Не вказано"}
                            </strong>
                          </div>

                          <div>
                            <span>Лікар</span>
                            <strong>
                              {history.doctor.first_name}{" "}
                              {history.doctor.last_name}{" "}
                              {history.doctor.middle_name}
                            </strong>
                          </div>

                          <div className="history-conclusion">
                            <span>Висновок</span>
                            <p>
                              {history.conclusion || "Висновок ще не вказано."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "medicines" && (
                      <div className="history-tab-panel">
                        {history.medicines.length === 0 ? (
                          <p className="empty-text">Ліки відсутні.</p>
                        ) : (
                          <div className="history-medicine-grid">
                            {history.medicines.map((medicine) => (
                              <div
                                key={medicine.id}
                                className="history-medicine-card"
                              >
                                <span>Ліки</span>
                                <strong>{medicine.medicine.name}</strong>

                                <span>Рецепт</span>
                                <p>{medicine.recipe}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "analysis" && (
                      <div className="history-tab-panel">
                        {history.analyses.length === 0 ? (
                          <p className="empty-text">Аналізи відсутні.</p>
                        ) : (
                          <div className="history-analysis-grid">
                            {history.analyses.map((analysis) => (
                              <div
                                key={analysis.id}
                                className="history-analysis-card"
                              >
                                <div className="history-analysis-header">
                                  <h3>{analysis.analysis.name}</h3>
                                  <Badge status={analysis.status} />
                                </div>

                                <div className="history-analysis-info">
                                  <div>
                                    <span>Лаборант</span>
                                    <strong>
                                      {analysis.laboratory_assistant.first_name}{" "}
                                      {analysis.laboratory_assistant.last_name}{" "}
                                      {
                                        analysis.laboratory_assistant
                                          .middle_name
                                      }
                                    </strong>
                                  </div>

                                  <div>
                                    <span>Результат</span>
                                    {analysis.status === "Відмовлено" ? (
                                      <p>Аналіз було скасовано.</p>
                                    ) : analysis.result ? (
                                      <Button
                                        variant="info"
                                        onClick={() =>
                                          window.open(
                                            `http://localhost:8000${analysis.result}`,
                                            "_blank",
                                          )
                                        }
                                      >
                                        Переглянути результат
                                      </Button>
                                    ) : (
                                      <p>
                                        Очікування результату. Будь ласка,
                                        зачекайте на завершення дослідження.
                                      </p>
                                    )}{" "}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default MedicalHistoryAccordion;

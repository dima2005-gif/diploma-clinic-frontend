import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import Badge from "../../components/UI/Badge";
import PatientLayout from "../../components/layouts/PatientLayout";

import "./MedicalHistoryDetail.css";

const MedicalHistoryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [patientData, setPatientData] = useState(null);
  const [historyDetail, setHistoryDetail] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const patientResponse = await api.get("/patient/");
        const historyResponse = await api.get(`/patient/medical-history/${id}`);

        setPatientData(patientResponse.data);
        setHistoryDetail(historyResponse.data);
      } catch (error) {
        console.error("Помилка при завантажені даних", error);
      }
    };

    fetchDetail();
  }, [id]);

  if (!patientData || !historyDetail) {
    return <Loader text="Завантажується історія, зачекайте..." />;
  }

  const isClosed = Boolean(historyDetail.date_departure);

  return (
    <PatientLayout patientData={patientData}>
      <div className="detail-topbar">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>

      <Card className="history-detail-card">
        <div className="history-detail-header">
          <div>
            <p className="history-label">Історія хвороби</p>

            <h1>{historyDetail.service}</h1>

            <p className="history-period">
              {new Date(historyDetail.date_arrival).toLocaleDateString("uk-UA")}{" "}
              —{" "}
              {historyDetail.date_departure
                ? new Date(historyDetail.date_departure).toLocaleDateString(
                  "uk-UA",
                )
                : "дотепер"}
            </p>
          </div>

          <span
            className={
              isClosed ? "history-status closed" : "history-status open"
            }
          >
            {isClosed ? "Закрита" : "Відкрита"}
          </span>
        </div>

        <div className="history-detail-grid">
          <div>
            <span>Лікар</span>
            <strong>
              {historyDetail.doctor.first_name} {historyDetail.doctor.last_name}{" "}
              {historyDetail.doctor.middle_name}
            </strong>
          </div>

          <div>
            <span>Діагноз</span>
            <strong>{historyDetail.diagnosis?.name || "Не вказано"}</strong>
          </div>

          <div>
            <span>Дата прибуття</span>
            <strong>
              {new Date(historyDetail.date_arrival).toLocaleDateString("uk-UA")}
            </strong>
          </div>

          <div>
            <span>Дата вибуття</span>
            <strong>
              {historyDetail.date_departure
                ? new Date(historyDetail.date_departure).toLocaleDateString(
                  "uk-UA",
                )
                : "Не вказано"}
            </strong>
          </div>
        </div>

        <div className="history-conclusion">
          <span>Висновок</span>
          <p>{historyDetail.conclusion || "Висновок ще не вказано."}</p>
        </div>
      </Card>

      <section className="history-detail-section">
        <div className="section-heading">
          <h2>Призначені аналізи</h2>
          <p>Аналізи, які були призначені в межах цієї історії хвороби.</p>
        </div>

        {historyDetail.analyses.length === 0 ? (
          <Card>
            <p className="empty-text">Аналізів не призначено.</p>
          </Card>
        ) : (
          <div className="history-analysis-grid">
            {historyDetail.analyses.map((item) => (
              <Card key={item.id} className="history-analysis-card">
                <div>
                  <div className="history-analysis-header">
                    <h3>{item.analysis.name}</h3>
                    <Badge status={item.status} />
                  </div>

                  <div className="history-analysis-meta">
                    <span>Лаборант</span>
                    <strong>
                      {item.laboratory_assistant.first_name}{" "}
                      {item.laboratory_assistant.last_name}
                    </strong>
                  </div>
                </div>

                {item.status === "Підтверджено" && item.result && (
                  <Button
                    variant="primary"
                    onClick={() =>
                      window.open(
                        `http://localhost:8000${item.result}`,
                        "_blank",
                      )
                    }
                  >
                    Переглянути результат
                  </Button>
                )}

                {item.status === "Заплановано" && (
                  <p className="analysis-note warning">
                    Очікування результату дослідження.
                  </p>
                )}

                {item.status === "Відмовлено" && (
                  <p className="analysis-note danger">Аналіз було відхилено.</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="history-detail-section">
        <div className="section-heading">
          <h2>Призначені ліки</h2>
          <p>Лікарські засоби та рекомендації щодо застосування.</p>
        </div>

        {historyDetail.medicines.length === 0 ? (
          <Card>
            <p className="empty-text">Ліків не призначено.</p>
          </Card>
        ) : (
          <div className="history-medicine-grid">
            {historyDetail.medicines.map((item) => (
              <Card key={item.id} className="history-medicine-card">
                <h3>{item.medicine.name}</h3>

                <div>
                  <span>Рецепт</span>
                  <p>{item.recipe}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </PatientLayout>
  );
};

export default MedicalHistoryDetail;

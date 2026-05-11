import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import Badge from "../../components/UI/Badge";
import PatientLayout from "../../components/layouts/PatientLayout";

import "./AnalysisDetail.css";

const AnalysisDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [patientData, setPatientData] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const patientResponse = await api.get("/patient/");
        const analysisResponse = await api.get(`/patient/analysis/${id}/`);

        setPatientData(patientResponse.data);
        setData(analysisResponse.data);
      } catch (error) {
        console.error("Помилка при завантажені даних", error);
      }
    };

    fetchDetail();
  }, [id]);

  if (!patientData || !data) {
    return <Loader text="Завантаження детальної інформації..." />;
  }

  const isConfirmed = data.status === "Підтверджено";
  const isRejected = data.status === "Відмовлено";
  const isPlanned = data.status === "Заплановано";

  return (
    <PatientLayout patientData={patientData}>
      <div className="detail-topbar">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>

      <Card className="analysis-detail-card">
        <div className="analysis-detail-header">
          <div>
            <p className="analysis-label">Аналіз</p>
            <h1>{data.analysis.name}</h1>
          </div>

          <Badge status={data.status} />
        </div>

        <p className="analysis-description">
          {data.analysis.description || "Опис відсутній"}
        </p>

        <div className="analysis-detail-grid">
          <div>
            <span>Дата призначення</span>
            <strong>
              {new Date(data.date_prescribed).toLocaleString("uk-UA")}
            </strong>
          </div>

          <div>
            <span>Лікар</span>
            <strong>
              {data.doctor.first_name} {data.doctor.last_name}{" "}
              {data.doctor.middle_name}
            </strong>
          </div>

          <div>
            <span>Лаборант</span>
            <strong>
              {data.laboratory_assistant.first_name}{" "}
              {data.laboratory_assistant.last_name}{" "}
              {data.laboratory_assistant.middle_name}
            </strong>
          </div>
        </div>
      </Card>

      {isConfirmed && data.result && (
        <Card className="analysis-result-card success">
          <div>
            <h2>Результат готовий</h2>
            <p>Результат аналізу доступний для перегляду у форматі PDF.</p>
          </div>

          <Button
            variant="primary"
            onClick={() =>
              window.open(`http://localhost:8000${data.result}`, "_blank")
            }
          >
            Переглянути результат
          </Button>
        </Card>
      )}

      {isConfirmed && !data.result && (
        <Card className="analysis-result-card warning">
          <div>
            <h2>Результат ще не завантажено</h2>
            <p>
              Статус аналізу підтверджено, але файл результату ще відсутній.
            </p>
          </div>
        </Card>
      )}

      {isPlanned && (
        <Card className="analysis-result-card warning">
          <div>
            <h2>Очікування результату</h2>
            <p>
              Аналіз заплановано. Будь ласка, зачекайте на завершення
              дослідження.
            </p>
          </div>
        </Card>
      )}

      {isRejected && (
        <Card className="analysis-result-card danger">
          <div>
            <h2>Аналіз відхилено</h2>
            <p>Для цього аналізу результат не формується.</p>
          </div>
        </Card>
      )}
    </PatientLayout>
  );
};

export default AnalysisDetail;

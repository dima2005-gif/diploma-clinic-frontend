import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const AnalysisDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/patient/analysis/${id}/`);
        setData(response.data);
      } catch (error) {
        console.error("Помилка при завантажені даних", error);
      }
    };
    fetchDetail();
  }, [id]);

  if (!data) return <div>Завантаження детальної інформації...</div>;

  return (
    <div className="analysis-page-detail">
      <h2>Деталі аналізу: {data.analysis.name}</h2>
      <div className="analysis-card">
        <p>
          <strong>Опис:</strong>
          {data.analysis.description}
        </p>
        <p>
          <strong>Дата призначення:</strong>
          {new Date(data.date_prescribed).toLocaleString("uk-UA")}
        </p>
        <p>
          <strong>Статус:</strong>
          {data.status}
        </p>
        <p>
          <strong>Лікар:</strong>
          {data.doctor.first_name} {data.doctor.last_name}{" "}
          {data.doctor.middle_name}
        </p>
        <p>
          <strong>Лаборант:</strong>
          {data.laboratory_assistant.first_name}{" "}
          {data.laboratory_assistant.last_name}{" "}
          {data.laboratory_assistant.middle_name}
        </p>
        <p>
          <strong>Результати:</strong>{" "}
          {data.result ? (
            <a
              href={`http://localhost:8000${data.result}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Переглянути результат
            </a>
          ) : (
            "Очікування результату. Будь ласка, зачекайте на завершення дослідження"
          )}
        </p>
      </div>
      <button onClick={() => navigate(-1)}>Повернутися до списку</button>
    </div>
  );
};

export default AnalysisDetail;

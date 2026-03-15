import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const MedicalHistoryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [history_detail, setHisoryDetail] = useState();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/patient/medical-history/${id}`);
        setHisoryDetail(response.data);
      } catch (error) {
        console.error("Помилка при завантажені даних", error);
      }
    };
    fetchDetail();
  }, [id]);

  if (!history_detail) {
    return <div>Завантажується історія, зачекайте</div>;
  }

  return (
    <div className="history-detail-conteiner">
      <div className="history">
        <h2>
          Історія хвороби за{" "}
          {new Date(history_detail.date_arrival).toLocaleDateString("uk-UA")} по{" "}
          {history_detail.date_departure
            ? new Date(history_detail.date_departure).toLocaleDateString(
              "uk-UA",
            )
            : "—"}{" "}
        </h2>
        <p>
          <strong>Послуга:</strong>
          {history_detail.service}
        </p>
        <p>
          <strong>Лікар:</strong>
          {history_detail.doctor.first_name} {history_detail.doctor.last_name}{" "}
          {history_detail.doctor.middle_name}
        </p>
        <p>
          <strong>Діагноз:</strong>
          {history_detail.diagnosis.name}
        </p>
        <p>
          <strong>Висновок:</strong>
          {history_detail.conclusion}
        </p>
      </div>
      <div className="analysis">
        <h2>Призначені аналізи</h2>
        {history_detail.analyses.map((item) => (
          <div key={item.id}>
            <p>
              <strong>Аналіз:</strong>
              {item.analysis.name}
            </p>
            <p>
              <strong>Лаборант</strong>
              {item.laboratory_assistant.first_name}{" "}
              {item.laboratory_assistant.last_name}
            </p>
            <p>
              <strong>Статус:</strong>
              {item.status}
            </p>
            <p>
              <strong>Результати:</strong>{" "}
              {item.result ? (
                <a
                  href={`http://localhost:8000${item.result}`}
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
        ))}
      </div>
      <div className="medicines">
        <h2>Призначені ліки</h2>
        {history_detail.medicines.map((item) => (
          <div key={item.id}>
            <p>
              <strong>Ліки:</strong>
              {item.medicine.name}
            </p>
            <p>
              <strong>Рецепт:</strong>
              {item.recipe}
            </p>
          </div>
        ))}
      </div>

      <button onClick={() => navigate(-1)}>Повернутися назад</button>
    </div>
  );
};

export default MedicalHistoryDetail;

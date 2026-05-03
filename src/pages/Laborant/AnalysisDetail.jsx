import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LaborantAnalysisResultForm from "../../components/laborant/analysis/LaborantAnalysisResultForm";
import api from "../../api/axios";

const LaborantAnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [isEditingResult, setIsEditingResult] = useState(false);

  const fetchAnalysis = async () => {
    try {
      const response = await api.get(`/laborant/analysis/${id}/`);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Помилка при завантаженні аналізу", error);
    }
  };

  const handleDeleteResult = async () => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити результат аналізу?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/laborant/analysis/${analysis.id}/result/delete/`);
      await fetchAnalysis();
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при видаленні результату";
      console.error("Помилка при видаленні результату", error);
      alert(message);
    }
  };
  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  if (!analysis) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Аналіз</h2>

      <div>
        <h3>Пацієнт</h3>
        <p>{analysis.patient.full_name}</p>
      </div>

      <div>
        <h3>Лікар</h3>
        <p>{analysis.doctor.full_name}</p>
      </div>

      <div>
        <h3>Аналіз</h3>
        <p>{analysis.analysis.name}</p>
        <p>
          Дата аналізу:{" "}
          {new Date(analysis.date_prescribed).toLocaleString("uk-UA")}
        </p>
        <p>Статус: {analysis.status}</p>
      </div>

      <div>
        <h3>Результат</h3>

        {isEditingResult ? (
          <LaborantAnalysisResultForm
            analysisId={analysis.id}
            onCancel={() => setIsEditingResult(false)}
            onSuccess={async () => {
              await fetchAnalysis();
              setIsEditingResult(false);
            }}
          />
        ) : (
          <>
            {analysis.result_url ? (
              <>
                <a
                  href={analysis.result_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Переглянути результат
                </a>

                <br />

                <button onClick={() => setIsEditingResult(true)}>
                  Оновити результат
                </button>

                <button onClick={handleDeleteResult}>Видалити результат</button>
              </>
            ) : (
              <>
                <p>Результат ще не додано</p>

                {analysis.status === "Підтверджено" && (
                  <button onClick={() => setIsEditingResult(true)}>
                    Додати результат
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
      <button onClick={() => navigate("/laborant/analyses/")}>Назад</button>
    </div>
  );
};

export default LaborantAnalysisDetail;

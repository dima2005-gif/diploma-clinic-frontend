import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const AdminAnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/admin/analysis/${id}/`);
        setAnalysis(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні аналізу", error);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (!analysis) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Аналіз</h2>

      <p>
        <strong>ID:</strong> {analysis.id}
      </p>

      <p>
        <strong>Назва:</strong> {analysis.name}
      </p>

      <p>
        <strong>Опис:</strong> {analysis.description}
      </p>

      <p>
        <strong>Вартість:</strong> {analysis.price} грн
      </p>

      <button
        onClick={() => navigate(`/administrator/analyses/${analysis.id}/edit/`)}
      >
        Редагувати
      </button>

      <button onClick={() => navigate("/administrator/analyses/")}>
        Назад
      </button>
    </div>
  );
};

export default AdminAnalysisDetail;

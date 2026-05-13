import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./AdminAnalysisDetail.css";

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
        toast.error("Не вдалося завантажити аналіз");
      }
    };

    fetchAnalysis();
  }, [id]);

  if (!analysis) {
    return <Loader text="Завантаження аналізу..." />;
  }

  return (
    <main className="admin-analysis-detail-page">
      <div className="admin-analysis-detail-topbar">
        <Button
          variant="outline"
          onClick={() => navigate("/administrator/analyses/")}
        >
          Назад
        </Button>
      </div>

      <Card className="admin-analysis-detail-hero">
        <div>
          <p className="analysis-detail-label">Аналіз</p>

          <h1>{analysis.name}</h1>

          <p className="analysis-detail-subtitle">
            ID: {analysis.id}
          </p>

          <div className="analysis-inline-price">
            <span>Вартість</span>

            <strong>
              {Number(analysis.price).toLocaleString("uk-UA")} грн
            </strong>
          </div>
        </div>
      </Card>

      <div className="admin-analysis-detail-grid">
        <Card className="admin-analysis-info-card">
          <h3>Опис аналізу</h3>

          <p>
            {analysis.description || "Опис аналізу відсутній."}
          </p>
        </Card>
      </div>

      <div className="admin-analysis-detail-actions">
        <Button
          variant="info"
          onClick={() =>
            navigate(`/administrator/analyses/${analysis.id}/edit/`)
          }
        >
          Редагувати
        </Button>
      </div>
    </main>
  );
};

export default AdminAnalysisDetail;

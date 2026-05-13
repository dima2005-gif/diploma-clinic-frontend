import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./AdminAnalysisList.css";

const AdminAnalysesList = () => {
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await api.get("/admin/analysis/");
        setAnalyses(response.data || []);
      } catch (error) {
        console.error("Помилка при завантаженні аналізів", error);
        toast.error("Не вдалося завантажити аналізи");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  if (loading) {
    return <Loader text="Завантаження аналізів..." />;
  }

  return (
    <main className="admin-analyses-page">
      <div className="admin-analyses-topbar">
        <Button variant="outline" onClick={() => navigate("/administrator/")}>
          Назад
        </Button>
      </div>

      <section className="admin-analyses-hero">
        <div>
          <h1>Аналізи</h1>

          <p>
            Керування лабораторними аналізами, їх описом та медичною
            інформацією.
          </p>
        </div>

        <Button
          variant="info"
          onClick={() => navigate("/administrator/analyses/create/")}
        >
          Додати аналіз
        </Button>
      </section>

      {analyses.length === 0 ? (
        <Card>
          <p className="empty-text">Аналізів не знайдено.</p>
        </Card>
      ) : (
        <div className="admin-analyses-grid">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="admin-analysis-card">
              <div>
                <h3>{analysis.name}</h3>
              </div>

              <div className="admin-analysis-actions">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/administrator/analyses/${analysis.id}/`)
                  }
                >
                  Детально
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminAnalysesList;

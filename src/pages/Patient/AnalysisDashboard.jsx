import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import Badge from "../../components/UI/Badge";

import "./AnalysisDashboard.css";

const AnalysisList = () => {
  const [analysis, setAnalysis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analysisResponse = await api.get("/patient/analysis/");

        setAnalysis(analysisResponse.data);
      } catch (error) {
        console.error("Помилка при завантаженні аналізів", error);
      }
    };

    fetchData();
  }, []);

  if (!analysis) {
    return <Loader text="Завантаження аналізів..." />;
  }

  return (
    <main className="analysis-page">
      <div className="detail-topbar">
        <Button variant="outline" onClick={() => navigate("/patient")}>
          Назад
        </Button>
      </div>

      <section className="analysis-hero">
        <h1>Призначені аналізи</h1>
        <p>
          Переглядайте призначені лабораторні дослідження, їх статус та
          результати.
        </p>
      </section>

      {analysis.length === 0 ? (
        <Card>
          <p className="empty-text">Призначених аналізів немає.</p>
        </Card>
      ) : (
        <div className="analysis-grid">
          {analysis.map((item) => (
            <Card key={item.id} className="analysis-card">
              <div>
                <div className="analysis-card-header">
                  <h3>{item.analysis.name}</h3>
                  <Badge status={item.status} />
                </div>

                <div className="analysis-meta">
                  <div>
                    <span>Дата</span>
                    <strong>
                      {new Date(item.date_prescribed).toLocaleDateString(
                        "uk-UA",
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Призначив</span>
                    <strong>
                      {item.doctor.first_name} {item.doctor.last_name}
                    </strong>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate(`/patient/analysis/${item.id}`)}
              >
                Детально
              </Button>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default AnalysisList;

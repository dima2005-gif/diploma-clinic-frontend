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
  const [selectedStatus, setSelectedStatus] = useState("all");
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
  const filteredAnalysis =
    selectedStatus === "all"
      ? analysis
      : analysis.filter((item) => item.status === selectedStatus);
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
      <div className="analysis-filter-tabs">
        <button
          className={selectedStatus === "all" ? "active" : ""}
          onClick={() => setSelectedStatus("all")}
        >
          Усі
        </button>

        <button
          className={selectedStatus === "Заплановано" ? "active" : ""}
          onClick={() => setSelectedStatus("Заплановано")}
        >
          Заплановані
        </button>

        <button
          className={selectedStatus === "Підтверджено" ? "active" : ""}
          onClick={() => setSelectedStatus("Підтверджено")}
        >
          Підтверджені
        </button>

        <button
          className={selectedStatus === "Відмовлено" ? "active" : ""}
          onClick={() => setSelectedStatus("Відмовлено")}
        >
          Відмовлені
        </button>
      </div>
      {filteredAnalysis.length === 0 ? (
        <Card>
          <p className="empty-text">Призначених аналізів немає.</p>
        </Card>
      ) : (
        <div className="analysis-grid">
          {filteredAnalysis.map((item) => (
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

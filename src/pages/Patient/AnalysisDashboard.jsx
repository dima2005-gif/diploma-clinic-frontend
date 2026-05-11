import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import Badge from "../../components/UI/Badge";
import PatientLayout from "../../components/layouts/PatientLayout";

import "./AnalysisDashboard.css";

const AnalysisList = () => {
  const [patientData, setPatientData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientResponse = await api.get("/patient/");
        const analysisResponse = await api.get("/patient/analysis/");

        setPatientData(patientResponse.data);
        setAnalysis(analysisResponse.data);
      } catch (error) {
        console.error("Помилка при завантаженні аналізів", error);
      }
    };

    fetchData();
  }, []);

  if (!patientData || !analysis) {
    return <Loader text="Завантаження аналізів..." />;
  }

  return (
    <PatientLayout patientData={patientData}>
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
    </PatientLayout>
  );
};

export default AnalysisList;

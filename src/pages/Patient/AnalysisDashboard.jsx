import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AnalysisList = () => {
  const [analysis, setAnalysis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get("/patient/analysis/");
        setAnalysis(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні аналізів", error);
      }
    };
    fetchAnalysis();
  }, []);

  if (!analysis) return <div>Завантаження аналізів...</div>;

  return (
    <div className="analysis-page">
      <h2>Призначені аналізи</h2>
      <table>
        <thead>
          <tr>
            <th>Назва аналізу</th>
            <th>Дата</th>
            <th>Призначив</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {analysis.map((analys) => (
            <tr key={analys.id}>
              <td>{analys.analysis.name}</td>
              <td>
                {new Date(analys.date_prescribed).toLocaleDateString("uk-UA")}
              </td>
              <td>
                {analys.doctor.first_name} {analys.doctor.last_name}
              </td>
              <td>{analys.status}</td>
              <td> <button
                onClick={() => navigate(`/patient/analysis/${analys.id}`)}
              >
                Детально
              </button></td>

            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate("/patient")}>
        Назад до головної сторінки
      </button>
    </div>
  );
};

export default AnalysisList;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AdminAnalysesList = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await api.get("/admin/analysis/");
        setAnalyses(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні аналізів", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  if (loading) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Список аналізів</h2>

      <button onClick={() => navigate("/administrator/analyses/create/")}>
        Додати аналіз
      </button>

      <table>
        <thead>
          <tr>
            <th>Назва</th>
            <th>Дії</th>
          </tr>
        </thead>

        <tbody>
          {analyses.length === 0 ? (
            <tr>
              <td colSpan="2">Аналізів не знайдено.</td>
            </tr>
          ) : (
            analyses.map((analysis) => (
              <tr key={analysis.id}>
                <td>{analysis.name}</td>

                <td>
                  <button
                    onClick={() =>
                      navigate(`/administrator/analyses/${analysis.id}/`)
                    }
                  >
                    Деталі
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button onClick={() => navigate("/administrator/")}>Назад</button>
    </div>
  );
};

export default AdminAnalysesList;

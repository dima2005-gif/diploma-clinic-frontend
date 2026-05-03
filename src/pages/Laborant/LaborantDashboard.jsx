import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { logoutUser } from "../../api/axios";

const LaborantDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/laborant/");
        setStats(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Вітаємо, {stats.name}</h2>

      <div>
        <p>Сьогодні аналізів</p>
        <p>{stats.today_count}</p>
      </div>

      <div>
        <p>Заплановано</p>
        <p>{stats.planned_count}</p>
      </div>

      <div>
        <p>Виконано</p>
        <p>{stats.completed_count}</p>
      </div>

      {stats.next_analysis?.time ? (
        <p>
          Найближчий аналіз: {stats.next_analysis.time} -{" "}
          {stats.next_analysis.patient}, {stats.next_analysis.analysis}
        </p>
      ) : (
        <p>Найближчих аналізів немає</p>
      )}

      <button onClick={() => navigate("/laborant/analyses/")}>Аналізи</button>

      <button onClick={logoutUser}>Вийти</button>
    </div>
  );
};

export default LaborantDashboard;

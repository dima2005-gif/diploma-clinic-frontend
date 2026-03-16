import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { logoutUser } from "../../api/axios";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/doctor/");
        setStats(response.data);
      } catch (error) {
        console.error("Помилка при завантажені", error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Вітаємо, {stats.name}</h2>

      <div>
        <div>
          <p>Сьогодні записів</p>
          <p>{stats.today_count}</p>
        </div>
      </div>

      <div>
        <div>
          <p>Заплановано</p>
          <p>{stats.planned_count}</p>
        </div>
      </div>

      <div>
        <div>
          <p>Підтверджено</p>
          <p>{stats.confirmed_count}</p>
        </div>
      </div>

      {stats.next_visit.time ? (
        <p>
          Найближчий прийом: {stats.next_visit.time} -{" "}
          {stats.next_visit.patient}
        </p>
      ) : (
        <p>Найближчих прийомів немає</p>
      )}
      <button onClick={() => navigate("/doctor/visit/")}>Візити</button>
      <button onClick={logoutUser}>Вийти</button>
    </div>
  );
};

export default DoctorDashboard;

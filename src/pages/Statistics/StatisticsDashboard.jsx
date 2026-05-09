import { useNavigate } from "react-router-dom";

const AdminStatistics = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Статистика</h2>

      <button
        onClick={() => navigate("/administrator/statistics/doctor-visits/")}
      >
        Відвідування лікарів
      </button>

      <button
        onClick={() =>
          navigate("/administrator/statistics/service-popularity/")
        }
      >
        Популярність послуг
      </button>

      <button
        onClick={() =>
          navigate("/administrator/statistics/analysis-popularity/")
        }
      >
        Кількість аналізів
      </button>

      <button onClick={() => navigate("/administrator/statistics/diagnoses/")}>
        Статистика захворюваності
      </button>

      <br />

      <button onClick={() => navigate("/administrator/")}>Назад</button>
    </div>
  );
};

export default AdminStatistics;

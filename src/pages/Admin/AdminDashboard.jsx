import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/axios";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Адмін-панель</h2>

      <div>
        <button onClick={() => navigate("/administrator/employees/")}>
          Співробітники
        </button>

        <button onClick={() => navigate("/administrator/services/")}>
          Послуги
        </button>

        <button onClick={() => navigate("/administrator/analyses/")}>
          Аналізи
        </button>

        <button onClick={() => navigate("/administrator/statistics/")}>
          Статистика
        </button>

        <button onClick={() => navigate("/administrator/audit/")}>Аудит</button>
      </div>

      <button onClick={logoutUser}>Вийти</button>
    </div>
  );
};

export default AdminDashboard;

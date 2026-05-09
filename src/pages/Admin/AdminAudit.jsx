import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AdminAudit = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    start_date: today,
    end_date: today,
  });

  const fetchAudit = async () => {
    if (filters.start_date > filters.end_date) {
      alert("Дата початку не може бути пізніше дати кінця");
      return;
    }

    setLoading(true);

    try {
      const response = await api.get("/admin/audit/", {
        params: {
          start_date: filters.start_date,
          end_date: filters.end_date,
        },
      });

      setAudit(response.data);
    } catch (error) {
      console.error("Помилка при завантаженні аудиту", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAudit();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div>
      <h2>Аудит дій користувачів</h2>

      <div>
        <label>Дата початку</label>
        <input
          type="date"
          name="start_date"
          value={filters.start_date}
          max={today}
          onChange={handleChange}
        />
        <label>Дата кінця</label>
        <input
          type="date"
          name="end_date"
          value={filters.end_date}
          max={today}
          onChange={handleChange}
        />
        <button onClick={fetchAudit}>Показати</button>
      </div>

      {loading ? (
        <p>Завантаження...</p>
      ) : audit.length === 0 ? (
        <p>Записів аудиту за вибраний період не знайдено.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Користувач</th>
              <th>Дія</th>
              <th>Модель</th>
              <th>Об'єкт</th>
            </tr>
          </thead>

          <tbody>
            {audit.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.date).toLocaleString("uk-UA")}</td>
                <td>{item.user}</td>
                <td>{item.action}</td>
                <td>{item.model}</td>
                <td>{item.object}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate("/administrator/")}>Назад</button>
    </div>
  );
};

export default AdminAudit;

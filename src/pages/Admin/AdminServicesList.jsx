import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AdminServicesList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/admin/service/");
        setServices(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні послуг", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Список послуг</h2>

      <button onClick={() => navigate("/administrator/services/create/")}>
        Додати послугу
      </button>

      <table>
        <thead>
          <tr>
            <th>Назва</th>
            <th>Дії</th>
          </tr>
        </thead>

        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan="2">Послуг не знайдено.</td>
            </tr>
          ) : (
            services.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/administrator/services/${service.id}/`)
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

export default AdminServicesList;

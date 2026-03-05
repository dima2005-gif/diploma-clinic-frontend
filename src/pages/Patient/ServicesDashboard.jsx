import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const DirectoryOfServices = () => {
  const naviate = useNavigate();
  const [services, setServices] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/patient/services/");
        setServices(response.data);
      } catch (error) {
        console.error("Помилка при завантажені послуг", error);
      }
    };
    fetchServices();
  }, []);

  if (!services) {
    return <div>Завантаження послуг...</div>;
  }
  return (
    <div className="services-page">
      <h2>Довідник послуг</h2>
      <table>
        <thead>
          <tr>
            <th>Назва послуги</th>
            <th>Вартість (грн)</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>{service.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => naviate("/patient")}>
        Назад до головної сторінки
      </button>
    </div>
  );
};

export default DirectoryOfServices;

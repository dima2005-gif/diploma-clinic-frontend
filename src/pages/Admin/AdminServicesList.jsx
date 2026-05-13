import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./AdminServicesList.css";

const AdminServicesList = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/admin/service/");
        setServices(response.data || []);
      } catch (error) {
        console.error("Помилка при завантаженні послуг", error);
        toast.error("Не вдалося завантажити послуги");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <Loader text="Завантаження послуг..." />;
  }

  return (
    <main className="admin-services-page">
      <div className="admin-services-topbar">
        <Button
          variant="outline"
          onClick={() => navigate("/administrator/")}
        >
          Назад
        </Button>
      </div>

      <section className="admin-services-hero">
        <div>
          <h1>Послуги</h1>

          <p>
            Керування медичними послугами поліклініки, їх описом та
            деталями.
          </p>
        </div>

        <Button
          variant="info"
          onClick={() => navigate("/administrator/services/create/")}
        >
          Додати послугу
        </Button>
      </section>

      {services.length === 0 ? (
        <Card>
          <p className="empty-text">Послуг не знайдено.</p>
        </Card>
      ) : (
        <div className="admin-services-grid">
          {services.map((service) => (
            <Card key={service.id} className="admin-service-card">
              <div>
                <h3>{service.name}</h3>

                <p>
                  {service.description || "Опис послуги відсутній"}
                </p>
              </div>

              <div className="admin-service-actions">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/administrator/services/${service.id}/`)
                  }
                >
                  Детально
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminServicesList;

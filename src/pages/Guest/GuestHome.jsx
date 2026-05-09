import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const GuestHome = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResponse = await api.get("/guest/services/");
        const doctorsResponse = await api.get("/guest/doctors/");

        setServices(servicesResponse.data);
        setDoctors(doctorsResponse.data);
      } catch (error) {
        console.error("Помилка при завантаженні гостьової сторінки", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>eKarta</h2>

      <button onClick={() => setActiveTab("services")}>Послуги</button>
      <button onClick={() => setActiveTab("doctors")}>Лікарі</button>
      <button onClick={() => navigate("/login/")}>Увійти</button>

      {activeTab === "services" && (
        <div>
          <h3>Наші послуги</h3>

          {services.map((service) => (
            <div key={service.id}>
              <h4>{service.name}</h4>
              <p>{service.description}</p>
              <p>{service.price} грн</p>

              <button onClick={() => navigate(`/services/${service.id}/`)}>
                Детальніше
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "doctors" && (
        <div>
          <h3>Наші лікарі</h3>

          {doctors.map((doctor) => (
            <div key={doctor.id}>
              <h4>{doctor.full_name}</h4>
              <p>{doctor.position}</p>
              <p>Рейтинг: {doctor.average_rating || "Немає оцінок"}</p>

              <button onClick={() => navigate(`/doctors/${doctor.id}/`)}>
                Детальніше
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestHome;

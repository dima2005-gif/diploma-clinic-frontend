import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";


import "./VisitCreate.css";

const CreateVisit = () => {
  const navigate = useNavigate();



  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedService, setSelectedService] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const servicesResponse = await api.get("/patient/services/");


        setServices(servicesResponse.data || []);
      } catch (error) {
        console.error("Помилка при завантаженні даних", error);
        toast.error("Не вдалося завантажити дані");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleServiceChange = async (serviceId) => {
    setSelectedService(serviceId);

    setSelectedDoctor("");
    setSelectedDate("");
    setSelectedSlot("");

    setDoctors([]);
    setSlots([]);

    if (!serviceId) return;

    try {
      const response = await api.get(`/patient/services/${serviceId}/`);

      const doctorsList = response.data
        .flatMap((item) => item.doctor)
        .filter(Boolean);

      setDoctors(doctorsList);
    } catch (error) {
      console.error("Помилка при завантаженні лікарів", error);
      toast.error("Не вдалося завантажити лікарів");
    }
  };

  const handleDoctorChange = async (doctorId) => {
    setSelectedDoctor(doctorId);

    setSelectedSlot("");
    setSlots([]);

    if (doctorId && selectedDate) {
      fetchSlots(doctorId, selectedDate);
    }
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);

    setSelectedSlot("");
    setSlots([]);

    if (selectedDoctor && date) {
      fetchSlots(selectedDoctor, date);
    }
  };

  const fetchSlots = async (doctorId, date) => {
    try {
      const response = await api.get(
        `/patient/appointments/availble-slots/?doctor=${doctorId}&date=${date}`,
      );

      setSlots(response.data.slots || []);
    } catch (error) {
      console.error("Помилка при завантаженні слотів", error);

      setSlots([]);

      toast.error("Не вдалося завантажити доступний час");
    }
  };

  const handleCreateVisit = async () => {
    if (!selectedService || !selectedDoctor || !selectedDate || !selectedSlot) {
      toast("Оберіть усі параметри візиту");
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post("/patient/visit/create/", {
        service: selectedService,
        doctor: selectedDoctor,
        date_prescribed: `${selectedDate}T${selectedSlot}:00Z`,
      });

      toast.success("Візит успішно створено");

      setTimeout(() => {
        navigate("/patient/visit");
      }, 1200);
    } catch (error) {
      console.error("Помилка при створенні візиту", error);

      toast.error("Не вдалося створити візит");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading ) {
    return <Loader text="Завантаження..." />;
  }

  return (
    <main className="visit-create-page">      <div className="visit-create-topbar">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>

      <section className="visit-create-hero">
        <h1>Створення візиту</h1>

        <p>Оберіть медичну послугу, лікаря, дату та доступний час запису.</p>
      </section>

      <Card className="visit-form-card">
        <div className="visit-form-grid">
          <div className="visit-form-group">
            <label>Послуга</label>

            <select
              value={selectedService}
              onChange={(e) => handleServiceChange(e.target.value)}
            >
              <option value="">Оберіть послугу</option>

              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="visit-form-group">
            <label>Лікар</label>

            <select
              value={selectedDoctor}
              onChange={(e) => handleDoctorChange(e.target.value)}
              disabled={!selectedService}
            >
              <option value="">Оберіть лікаря</option>

              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.first_name} {doctor.last_name} {doctor.middle_name}
                </option>
              ))}
            </select>
          </div>

          <div className="visit-form-group">
            <label>Дата</label>

            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleDateChange(e.target.value)}
              disabled={!selectedDoctor}
            />
          </div>
        </div>

        <div className="visit-slots-section">
          <h2>Доступний час</h2>

          {!selectedDoctor || !selectedDate ? (
            <p className="empty-text">
              Оберіть лікаря та дату для перегляду слотів.
            </p>
          ) : slots.length === 0 ? (
            <p className="empty-text">На обрану дату немає доступного часу.</p>
          ) : (
            <div className="visit-slots-grid">
              {slots.map((slot, index) => (
                <button
                  type="button"
                  key={index}
                  className={`slot-button ${selectedSlot === slot ? "active" : ""
                    }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="visit-submit-row">
          <Button
            variant="info"
            onClick={handleCreateVisit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Створення..." : "Створити візит"}
          </Button>
        </div>
      </Card>
    </main>
  );
};

export default CreateVisit;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import PatientLayout from "../../components/layouts/PatientLayout";

import "./VisitUpdate.css";

const UpdateVisit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState(null);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedService, setSelectedService] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const patientResponse = await api.get("/patient/");
        const visitResponse = await api.get(`/patient/visit/${id}/update/`);
        const servicesResponse = await api.get("/patient/services/");

        const visit = visitResponse.data;

        setPatientData(patientResponse.data);
        setServices(servicesResponse.data || []);

        if (visit.status !== "Заплановано") {
          setIsLocked(true);
          return;
        }

        const dt = new Date(visit.date_prescribed);
        const date = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
        const time = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;

        setSelectedService(String(visit.service.id));
        setSelectedDoctor(String(visit.doctor.id));
        setSelectedDate(date);
        setSelectedSlot(time);

        const doctorsResponse = await api.get(
          `/patient/services/${visit.service.id}/`,
        );
        const doctorsList = (doctorsResponse.data || [])
          .flatMap((item) => item.doctor)
          .filter(Boolean);

        setDoctors(doctorsList);

        const slotsResponse = await api.get(
          `/patient/appointments/availble-slots/?doctor=${visit.doctor.id}&date=${date}`,
        );

        setSlots(slotsResponse.data.slots || []);
      } catch (error) {
        console.error("Помилка при завантаженні візиту", error);
        toast.error("Не вдалося завантажити візит");
      } finally {
        setLoading(false);
      }
    };

    fetchVisit();
  }, [id]);

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

      const doctorsList = (response.data || [])
        .flatMap((item) => item.doctor)
        .filter(Boolean);

      setDoctors(doctorsList);
    } catch (error) {
      console.error("Помилка при завантаженні лікарів", error);
      toast.error("Не вдалося завантажити лікарів");
    }
  };

  const handleDoctorChange = (doctorId) => {
    setSelectedDoctor(doctorId);
    setSelectedSlot("");
    setSlots([]);

    if (doctorId && selectedDate) {
      fetchSlots(doctorId, selectedDate);
    }
  };

  const handleDateChange = (date) => {
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

  const handleUpdateVisit = async () => {
    if (!selectedService || !selectedDoctor || !selectedDate || !selectedSlot) {
      toast("Оберіть усі параметри візиту");
      return;
    }

    try {
      setIsSubmitting(true);

      await api.put(`/patient/visit/${id}/update/`, {
        service_id: selectedService,
        doctor_id: selectedDoctor,
        date_prescribed: `${selectedDate}T${selectedSlot}:00`,
      });

      toast.success("Візит успішно оновлено");

      setTimeout(() => {
        navigate("/patient/visit");
      }, 1200);
    } catch (error) {
      console.error("Помилка при оновленні візиту", error);
      toast.error("Не вдалося оновити візит");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !patientData) {
    return <Loader text="Завантаження візиту..." />;
  }

  return (
    <PatientLayout patientData={patientData}>
      <div className="visit-update-topbar">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>

      {isLocked ? (
        <Card className="visit-locked-card">
          <h1>Редагування недоступне</h1>
          <p>
            Цей запис не можна редагувати, оскільки він вже не має статусу
            “Заплановано”.
          </p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Повернутися назад
          </Button>
        </Card>
      ) : (
        <>
          <section className="visit-update-hero">
            <h1>Редагування візиту</h1>
            <p>Змініть послугу, лікаря, дату або доступний час запису.</p>
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
                      {doctor.first_name} {doctor.last_name}{" "}
                      {doctor.middle_name}
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
                <p className="empty-text">
                  На обрану дату немає доступного часу.
                </p>
              ) : (
                <div className="visit-slots-grid">
                  {slots.map((slot, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`slot-button ${selectedSlot === slot ? "active" : ""}`}
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
                onClick={handleUpdateVisit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Збереження..." : "Зберегти зміни"}
              </Button>
            </div>
          </Card>
        </>
      )}
    </PatientLayout>
  );
};

export default UpdateVisit;

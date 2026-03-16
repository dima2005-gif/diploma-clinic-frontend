import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CreateVisit = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");

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

  const fetchServiceSelected = async (service) => {
    setSelectedService({ ...service, doctors: [] });
    setSelectedDoctor("");
    setSelectedDate("");
    setAvailableSlots([]);
    setSelectedSlot("");
    try {
      const response = await api.get(`/patient/services/${service.id}/`);
      const doctors = response.data
        .flatMap((item) => item.doctor)
        .filter(Boolean)
        .map((d) => ({ ...d, id: Number(d.id) }));
      setSelectedService((prev) => ({ ...prev, doctors }));
    } catch (error) {
      console.error("Помилка при завантажені лікарів", error);
    }
  };

  const fetchDoctorSelected = async (doctor) => {
    if (!doctor) return;
    setSelectedDoctor(doctor);
    setAvailableSlots([]);
    setSelectedSlot("");
  };

  const fetchDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot("");
    if (selectedDoctor && date) {
      fetchAvialableSlots(selectedDoctor.id, date);
    }
  };

  const fetchAvialableSlots = async (doctorId, date) => {
    try {
      const response = await api.get(
        `/patient/appointments/availble-slots/?doctor=${doctorId}&date=${date}`,
      );
      setAvailableSlots(response.data.slots);
    } catch (error) {
      console.error("Помилка при завантажені слотів", error);
      setAvailableSlots([]);
    }
  };

  const fetchCreateVisit = async () => {
    if (!selectedService || !selectedDoctor || !selectedDate || !selectedSlot) {
      setMessage("Оберіть усі параметри перед записом");
      return;
    }
    try {
      await api.post("/patient/visit/create/", {
        service: selectedService.id,
        doctor: selectedDoctor.id,
        date_prescribed: `${selectedDate}T${selectedSlot}:00`,
      });
      setMessage("Візит успішно створено!");
      setTimeout(() => navigate(-1), 2500);
    } catch (error) {
      console.error(error);
      setMessage("Помилка при створенні візиту");
    }
  };
const today = new Date();
const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return (
    <div>
      <h2>Створення візиту</h2>
      <div>
        <label>Оберіть послугу:</label>
        <select
          onChange={(e) =>
            fetchServiceSelected(services.find((s) => s.id == e.target.value))
          }
        >
          <option value="">--Оберіть--</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {selectedService?.doctors && selectedService.doctors.length > 0 && (
        <div>
          <label>Оберіть лікаря:</label>
          <select
            onChange={(e) =>
              fetchDoctorSelected(
                selectedService.doctors.find(
                  (d) => d.id == Number(e.target.value),
                ),
              )
            }
            value={selectedDoctor?.id || ""}
          >
            <option value="">--Оберіть--</option>
            {selectedService.doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.first_name} {d.last_name} {d.middle_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedDoctor && (
        <div>
          <label>Оберіть дату:</label>
          <input
            type="date"
            value={selectedDate}
            min={minDate}
            onChange={(e) => fetchDateChange(e.target.value)}
          />
        </div>
      )}

      {availableSlots.length > 0 && (
        <div>
          <label>Оберіть час:</label>
          <select
            onChange={(e) => setSelectedSlot(e.target.value)}
            value={selectedSlot}
          >
            <option value="">-- Оберіть --</option>
            {availableSlots.map((slot, idx) => (
              <option key={idx} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      )}
      <button onClick={fetchCreateVisit}>Створити</button>
      {message && <p>{message}</p>}
      <button onClick={() => navigate(-1)}>Назад</button>
    </div>
  );
};

export default CreateVisit;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const UpdateVisit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");
  const [isLocked, setIsLocked] = useState(false); // если не "Заплановано"

  // Загружаем существующий визит
  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const res = await api.get(`/patient/visit/${id}/update/`);
        const visit = res.data;

        if (visit.status !== "Заплановано") {
          setIsLocked(true);
          setMessage("Цей запис не можна редагувати");
          return;
        }

        // Заполняем дату и время из существующего визита
        const dt = new Date(visit.date_prescribed);
        const date = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
        const time = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
        setSelectedDate(date);
        setSelectedSlot(time);
        setSelectedDoctor(visit.doctor);

        // Загружаем услуги
        const servicesRes = await api.get("/patient/services/");
        setServices(servicesRes.data);

        // Загружаем докторов для услуги
        const doctorsRes = await api.get(
          `/patient/services/${visit.service.id}/`,
        );
        const doctors = doctorsRes.data
          .flatMap((item) => item.doctor)
          .filter(Boolean)
          .map((d) => ({ ...d, id: Number(d.id) }));

        setSelectedService({ ...visit.service, doctors });

        // Загружаем слоты
        const slotsRes = await api.get(
          `/patient/appointments/availble-slots/?doctor=${visit.doctor.id}&date=${date}`,
        );
        setAvailableSlots(slotsRes.data.slots);
      } catch (error) {
        console.error("Помилка при завантаженні візиту", error);
      }
    };
    fetchVisit();
  }, [id]);

  const fetchServiceSelected = async (service) => {
    setSelectedService({ ...service, doctors: [] });
    setSelectedDoctor("");
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
      console.error("Помилка при завантаженні лікарів", error);
    }
  };

  const fetchDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot("");
    if (selectedDoctor && date) {
      fetchAvailableSlots(selectedDoctor.id, date);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    try {
      const response = await api.get(
        `/patient/appointments/availble-slots/?doctor=${doctorId}&date=${date}`,
      );
      setAvailableSlots(response.data.slots);
    } catch (error) {
      console.error("Помилка при завантаженні слотів", error);
      setAvailableSlots([]);
    }
  };

  const fetchUpdateVisit = async () => {
    if (!selectedService || !selectedDoctor || !selectedDate || !selectedSlot) {
      setMessage("Оберіть усі параметри");
      return;
    }
    try {
      await api.put(`/patient/visit/${id}/update/`, {
        service_id: selectedService.id,
        doctor_id: selectedDoctor.id,
        date_prescribed: `${selectedDate}T${selectedSlot}:00`,
      });
      setMessage("Візит успішно оновлено!");
      setTimeout(() => navigate(-1), 2500);
    } catch (error) {
      console.error(error);
      setMessage("Помилка при оновленні візиту");
    }
  };

  if (isLocked) {
    return (
      <div>
        <p>{message}</p>
        <button onClick={() => navigate(-1)}>Назад</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Редагування візиту</h2>

      <div>
        <label>Оберіть послугу:</label>
        <select
          value={selectedService?.id || ""}
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

      {selectedService?.doctors?.length > 0 && (
        <div>
          <label>Оберіть лікаря:</label>
          <select
            value={selectedDoctor?.id || ""}
            onChange={(e) =>
              setSelectedDoctor(
                selectedService.doctors.find(
                  (d) => d.id == Number(e.target.value),
                ),
              )
            }
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
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => fetchDateChange(e.target.value)}
          />
        </div>
      )}

      {availableSlots.length > 0 && (
        <div>
          <label>Оберіть час:</label>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            <option value="">--Оберіть--</option>
            {availableSlots.map((slot, idx) => (
              <option key={idx} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={fetchUpdateVisit}>Зберегти</button>
      {message && <p>{message}</p>}
      <button onClick={() => navigate(-1)}>Назад</button>
    </div>
  );
};

export default UpdateVisit;

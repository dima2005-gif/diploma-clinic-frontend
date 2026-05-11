import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import Badge from "../../components/UI/Badge";
import PatientLayout from "../../components/layouts/PatientLayout";
import Modal from "../../components/UI/Modal";

import "./VisitsList.css";

const VisitsList = () => {
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState(null);
  const [visits, setVisits] = useState(null);
const [visitToCancel, setVisitToCancel] = useState(null);
const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const patientResponse = await api.get("/patient/");
        const visitsResponse = await api.get("/patient/visit/");

        setPatientData(patientResponse.data);
        setVisits(visitsResponse.data);
      } catch (error) {
        console.error("Помилка при завантажені даних", error);
      }
    };

    fetchVisit();
  }, []);
const handleCancelVisit = async () => {
  if (!visitToCancel) return;

  try {
    setIsCancelling(true);

    await api.patch(`/patient/visit/${visitToCancel.id}/cancel/`);

    setVisits((prev) =>
      prev.map((visit) =>
        visit.id === visitToCancel.id
          ? { ...visit, status: "Відмовлено" }
          : visit,
      ),
    );

    toast.success("Візит успішно скасовано");
    setVisitToCancel(null);
  } catch (error) {
    console.error("Помилка при скасуванні візиту", error);
    toast.error("Не вдалося скасувати візит");
  } finally {
    setIsCancelling(false);
  }
};
  if (!patientData || !visits) {
    return <Loader text="Завантажується список візитів..." />;
  }

  return (
    <PatientLayout patientData={patientData}>
      <div className="visits-topbar">
        <Button variant="outline" onClick={() => navigate("/patient")}>
          Назад
        </Button>

        <Button variant="info" onClick={() => navigate("/patient/visit/create")}>
          Створити візит
        </Button>
      </div>

      <section className="visits-hero">
        <h1>Візити</h1>
        <p>
          Переглядайте заплановані, підтверджені та відхилені записи до лікарів.
        </p>
      </section>

      {visits.length === 0 ? (
        <Card>
          <p className="empty-text">Візитів ще немає.</p>
        </Card>
      ) : (
        <div className="visits-grid">
          {visits.map((visit) => (
            <Card key={visit.id} className="visit-card">
              <div>
                <div className="visit-card-header">
                  <h3>{visit.service.name}</h3>
                  <Badge status={visit.status} />
                </div>

                <div className="visit-meta">
                  <div>
                    <span>Лікар</span>
                    <strong>
                      {visit.doctor.first_name} {visit.doctor.last_name}{" "}
                      {visit.doctor.middle_name}
                    </strong>
                  </div>

                  <div>
                    <span>Дата запису</span>
                    <strong>
                      {new Date(visit.date_prescribed).toLocaleString("uk-UA")}
                    </strong>
                  </div>
                </div>
              </div>

              {visit.status === "Заплановано" && (
  <div className="visit-actions">
    <Button
      variant="outline"
      onClick={() => navigate(`/patient/visit/${visit.id}/update`)}
    >
      Редагувати
    </Button>

    <Button
      variant="danger"
      onClick={() => setVisitToCancel(visit)}
    >
      Скасувати
    </Button>
  </div>
)}            </Card>
          ))}
        </div>
      )}
<Modal
  isOpen={!!visitToCancel}
  onClose={() => setVisitToCancel(null)}
>
  <h2>Скасувати візит?</h2>

  <p>
    Ви дійсно хочете скасувати запис?
  </p>

  <div className="modal-actions">
    <Button
      variant="outline"
      onClick={() => setVisitToCancel(null)}
    >
      Ні
    </Button>

    <Button
      variant="danger"
      onClick={handleCancelVisit}
    >
      Так, скасувати
    </Button>
  </div>
</Modal>
    </PatientLayout>
  );
};

export default VisitsList;

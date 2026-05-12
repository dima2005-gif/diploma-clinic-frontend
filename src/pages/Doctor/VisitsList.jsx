import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import Badge from "../../components/UI/Badge";
import Modal from "../../components/UI/Modal";


import "./VisitsList.css";

const DoctorVisitsList = () => {
  const navigate = useNavigate();


  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [activeFilter, setActiveFilter] = useState("planned");

  useEffect(() => {
    const fetchData = async () => {
      try {
const response = await api.get("/doctor/visit/");

setVisits(response.data || []);
      } catch (error) {
        console.error("Помилка при завантажені записів", error);
        toast.error("Не вдалося завантажити записи");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async () => {
    if (!modal) return;

    try {
      setIsUpdating(true);

      await api.patch(`/doctor/visit/${modal.id}/confirm/`, {
        action: modal.action,
      });

      const newStatus =
        modal.action === "confirm" ? "Підтверджено" : "Відмовлено";

      setVisits((prev) =>
        prev.map((visit) =>
          visit.id === modal.id
            ? {
                ...visit,
                status: newStatus,
              }
            : visit,
        ),
      );

      toast.success(
        modal.action === "confirm"
          ? "Запис підтверджено"
          : "Запис відхилено",
      );

      setModal(null);
    } catch (error) {
      console.error("Помилка при зміні статусу", error);
      toast.error("Не вдалося змінити статус запису");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading ) {
    return <Loader text="Завантаження записів..." />;
  }

  const visitGroups = {
    planned: {
      title: "Заплановані",
      description: "Записи, які очікують підтвердження або відхилення.",

      items: visits.filter(
        (visit) =>
          visit.status === "Заплановано" &&
          !visit.has_medical_history,
      ),
    },

    confirmed: {
      title: "Підтверджені",
      description: "Записи, з якими лікар може працювати далі.",

      items: visits.filter(
        (visit) =>
          visit.status === "Підтверджено" &&
          !visit.has_medical_history,
      ),
    },

    rejected: {
      title: "Відмовлені",
      description: "Скасовані або відхилені записи пацієнтів.",

      items: visits.filter(
        (visit) =>
          visit.status === "Відмовлено" &&
          !visit.has_medical_history,
      ),
    },

    openHistories: {
      title: "Відкриті історії",
      description:
        "Медичні історії, які ще знаходяться в роботі лікаря.",

      items: visits.filter(
        (visit) =>
          visit.has_medical_history &&
          !visit.date_departure,
      ),
    },

    closedHistories: {
      title: "Закриті історії",
      description: "Завершені медичні історії пацієнтів.",

      items: visits.filter(
        (visit) =>
          visit.has_medical_history &&
          visit.date_departure,
      ),
    },
  };

  const currentGroup = visitGroups[activeFilter];

  const renderVisitCard = (visit) => (
    <Card key={visit.id} className="doctor-visit-card">
      <div>
        <div className="doctor-visit-header">
          <h3>
            {visit.patient.first_name} {visit.patient.last_name}
          </h3>

          <Badge status={visit.status} />
        </div>

        <div className="doctor-visit-meta">
          <div>
            <span>Послуга</span>
            <strong>{visit.service_name}</strong>
          </div>

          <div>
            <span>Дата прийому</span>

            <strong>
              {new Date(visit.date_prescribed).toLocaleString("uk-UA")}
            </strong>
          </div>
        </div>
      </div>

      {visit.status === "Заплановано" && (
        <div className="doctor-visit-actions">
          <Button
            variant="primary"
            onClick={() =>
              setModal({
                id: visit.id,
                action: "confirm",
                visit,
              })
            }
          >
            Підтвердити
          </Button>

          <Button
            variant="danger"
            onClick={() =>
              setModal({
                id: visit.id,
                action: "reject",
                visit,
              })
            }
          >
            Відхилити
          </Button>
        </div>
      )}

      {visit.status === "Підтверджено" && (
        <div className="doctor-visit-actions">
          <Button
            variant="info"
            onClick={() => navigate(`/doctor/visit/${visit.id}/`)}
          >
            Відкрити
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <main className="doctor-visits-page">
         <div className="doctor-visits-topbar">
        <Button
          variant="outline"
          onClick={() => navigate("/doctor/")}
        >
          Назад
        </Button>
      </div>

      <section className="doctor-visits-hero">
        <h1>Записи пацієнтів</h1>

        <p>
          Переглядайте записи, історії хвороб та керуйте
          робочими процесами лікаря.
        </p>
      </section>

      <div className="doctor-filter-chips">
        <button
          className={
            activeFilter === "planned"
              ? "filter-chip active"
              : "filter-chip"
          }
          onClick={() => setActiveFilter("planned")}
        >
          Заплановані
        </button>

        <button
          className={
            activeFilter === "confirmed"
              ? "filter-chip active"
              : "filter-chip"
          }
          onClick={() => setActiveFilter("confirmed")}
        >
          Підтверджені
        </button>

        <button
          className={
            activeFilter === "rejected"
              ? "filter-chip active"
              : "filter-chip"
          }
          onClick={() => setActiveFilter("rejected")}
        >
          Відмовлені
        </button>

        <button
          className={
            activeFilter === "openHistories"
              ? "filter-chip active"
              : "filter-chip"
          }
          onClick={() => setActiveFilter("openHistories")}
        >
          Відкриті історії
        </button>

        <button
          className={
            activeFilter === "closedHistories"
              ? "filter-chip active"
              : "filter-chip"
          }
          onClick={() => setActiveFilter("closedHistories")}
        >
          Закриті історії
        </button>
      </div>

      <section className="doctor-visits-section">
        <div className="section-heading">
          <h2>{currentGroup.title}</h2>
          <p>{currentGroup.description}</p>
        </div>

        {currentGroup.items.length === 0 ? (
          <Card>
            <p className="empty-text">
              Записів не знайдено.
            </p>
          </Card>
        ) : (
          <div className="doctor-visits-grid">
            {currentGroup.items.map(renderVisitCard)}
          </div>
        )}
      </section>

      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
      >
        <div className="visit-confirm-modal">
          <h2>
            {modal?.action === "confirm"
              ? "Підтвердити запис?"
              : "Відхилити запис?"}
          </h2>

          <p>
            {modal?.action === "confirm"
              ? "Ви дійсно хочете підтвердити цей запис пацієнта?"
              : "Ви дійсно хочете відхилити цей запис пацієнта?"}
          </p>

          {modal?.visit && (
            <div className="modal-visit-info">
              <span>Пацієнт</span>

              <strong>
                {modal.visit.patient.first_name}{" "}
                {modal.visit.patient.last_name}
              </strong>

              <span>Послуга</span>

              <strong>
                {modal.visit.service_name}
              </strong>
            </div>
          )}

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setModal(null)}
              disabled={isUpdating}
            >
              Скасувати
            </Button>

            <Button
              variant={
                modal?.action === "confirm"
                  ? "primary"
                  : "danger"
              }
              onClick={handleStatusChange}
              disabled={isUpdating}
            >
              {isUpdating
                ? "Збереження..."
                : modal?.action === "confirm"
                  ? "Підтвердити"
                  : "Відхилити"}
            </Button>
          </div>
        </div>
      </Modal>
</main>
  );
};

export default DoctorVisitsList;

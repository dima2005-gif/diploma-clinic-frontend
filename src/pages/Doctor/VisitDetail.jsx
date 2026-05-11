import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import DiagnosisTab from "../../components/doctor/diagnosis/DiagnosisTab";
import MedicinesTab from "../../components/doctor/medicines/MedicinesTab";
import AnalysisTab from "../../components/doctor/analysis/AnalysisTab";

import api, { logoutUser } from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import Badge from "../../components/UI/Badge";
import Modal from "../../components/UI/Modal";

import DoctorLayout from "../../components/layouts/DoctorLayout";

import "./VisitDetail.css";

const DoctorVisitDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [visit, setVisit] = useState(null);

  const [activeTab, setActiveTab] = useState("diagnosis");

  const [closeModal, setCloseModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const fetchVisit = async () => {
    try {
      const [visitResponse, statsResponse] = await Promise.all([
        api.get(`/doctor/visit/${id}/`),
        api.get("/doctor/"),
      ]);

      setVisit(visitResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Помилка при завантажені", error);
      toast.error("Не вдалося завантажити прийом");
    }
  };
  useEffect(() => {
    fetchVisit();
  }, [id]);

  const handleCloseHistory = async () => {
    try {
      setIsClosing(true);

      await api.patch(`/doctor/visit/${visit.id}/close-history/`);

      toast.success("Історію хвороби закрито");

      await fetchVisit();

      setCloseModal(false);
    } catch (error) {
      console.error("Помилка при закритті історії", error);

      toast.error("Не вдалося закрити історію");
    } finally {
      setIsClosing(false);
    }
  };

  if (!visit || !stats) {
    return <Loader text="Завантаження прийому..." />;
  }

  const isHistoryClosed = !!visit.history?.date_departure;

  return (
    <DoctorLayout
      doctorName={stats.name}
      position={stats.position}
      stats={stats}
      onLogout={logoutUser}
    >
      {" "}
      <div className="visit-detail-topbar">
        <Button variant="outline" onClick={() => navigate("/doctor/visit/")}>
          Назад
        </Button>
      </div>
      <section className="visit-detail-hero">
        <div>
          <h1>
            {visit.patient.last_name} {visit.patient.first_name}{" "}
            {visit.patient.middle_name}
          </h1>

          <p>
            {visit.service_name} •{" "}
            {new Date(visit.date_prescribed).toLocaleString("uk-UA")}
          </p>
        </div>

        <Badge status={visit.status} />
      </section>
      <div className="visit-detail-grid">
        <Card className="visit-info-card">
          <h3>Інформація про пацієнта</h3>

          <div className="visit-info-list">
            <div>
              <span>Дата народження</span>
              <strong>{visit.patient.date_of_birth}</strong>
            </div>

            <div>
              <span>Стать</span>
              <strong>{visit.patient.sex}</strong>
            </div>

            <div>
              <span>Телефон</span>
              <strong>{visit.patient.phone_number}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{visit.patient.email}</strong>
            </div>

            <div>
              <span>Вага</span>
              <strong>{visit.patient.weight} кг</strong>
            </div>

            <div>
              <span>Зріст</span>
              <strong>{visit.patient.height} см</strong>
            </div>

            <div>
              <span>Група крові</span>
              <strong>{visit.patient.blood_group}</strong>
            </div>
          </div>
        </Card>
        <Card className="visit-actions-card">
          <h3>Керування прийомом</h3>

          <div className="visit-actions-content">
            <div className="visit-action-status">
              <span>Стан історії</span>

              <strong>
                {visit.history
                  ? isHistoryClosed
                    ? "Закрита"
                    : "Відкрита"
                  : "Ще не створена"}
              </strong>
            </div>

            <Button
              variant="info"
              onClick={() =>
                navigate(
                  `/doctor/visit/${id}/medical-history/${visit.patient.id}`,
                )
              }
            >
              Переглянути історію
            </Button>

            {visit.history && !isHistoryClosed && (
              <Button variant="danger" onClick={() => setCloseModal(true)}>
                Закрити історію
              </Button>
            )}

            {isHistoryClosed && (
              <div className="history-closed-box">
                <span>Історію хвороби закрито</span>
                <strong>{visit.history.date_departure}</strong>
              </div>
            )}
          </div>
        </Card>{" "}
      </div>
      <div className="visit-tabs">
        <button
          className={
            activeTab === "diagnosis" ? "visit-tab active" : "visit-tab"
          }
          onClick={() => setActiveTab("diagnosis")}
        >
          Діагноз
        </button>

        <button
          className={
            activeTab === "medicines" ? "visit-tab active" : "visit-tab"
          }
          onClick={() => setActiveTab("medicines")}
        >
          Ліки
        </button>

        <button
          className={
            activeTab === "analysis" ? "visit-tab active" : "visit-tab"
          }
          onClick={() => setActiveTab("analysis")}
        >
          Аналізи
        </button>
      </div>
      <section className="visit-tab-content">
        {activeTab === "diagnosis" && (
          <DiagnosisTab visit={visit} refresh={fetchVisit} />
        )}

        {activeTab === "medicines" && (
          <MedicinesTab visit={visit} refresh={fetchVisit} />
        )}

        {activeTab === "analysis" && (
          <AnalysisTab visit={visit} refresh={fetchVisit} />
        )}
      </section>
      <Modal isOpen={closeModal} onClose={() => setCloseModal(false)}>
        <div className="close-history-modal">
          <h2>Закрити історію хвороби?</h2>

          <p>
            Після закриття історії редагування діагнозів, ліків та аналізів
            стане недоступним.
          </p>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setCloseModal(false)}
              disabled={isClosing}
            >
              Скасувати
            </Button>

            <Button
              variant="danger"
              onClick={handleCloseHistory}
              disabled={isClosing}
            >
              {isClosing ? "Закриття..." : "Закрити історію"}
            </Button>
          </div>
        </div>
      </Modal>
    </DoctorLayout>
  );
};

export default DoctorVisitDetail;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import Badge from "../../components/UI/Badge";
import Modal from "../../components/UI/Modal";

import "./AnalysisList.css";

const LaborantAnalysisList = () => {
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeFilter, setActiveFilter] = useState("planned");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/laborant/analysis/");

        setAnalyses(response.data || []);
      } catch (error) {
        console.error("Помилка при завантаженні аналізів", error);
        toast.error("Не вдалося завантажити аналізи");
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

      await api.patch(`/laborant/analysis/${modal.id}/confirm/`, {
        action: modal.action,
      });

      const newStatus =
        modal.action === "confirm" ? "Підтверджено" : "Відмовлено";

      setAnalyses((prev) =>
        prev.map((item) =>
          item.id === modal.id ? { ...item, status: newStatus } : item,
        ),
      );

      toast.success(
        modal.action === "confirm" ? "Аналіз підтверджено" : "Аналіз відхилено",
      );

      setModal(null);
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при зміні статусу аналізу";

      console.error("Помилка при зміні статусу аналізу", error);
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <Loader text="Завантаження аналізів..." />;
  }

  const analysisGroups = {
    planned: {
      title: "Заплановані",
      description: "Аналізи, які очікують виконання або підтвердження.",
      items: analyses.filter((item) => item.status === "Заплановано"),
    },

    withoutResult: {
      title: "Без результату",
      description: "Підтверджені аналізи без завантаженого результату.",
      items: analyses.filter(
        (item) => item.status === "Підтверджено" && !item.result_url,
      ),
    },

    withResult: {
      title: "Є результат",
      description: "Аналізи із завантаженим результатом дослідження.",
      items: analyses.filter((item) => item.result_url),
    },

    rejected: {
      title: "Відмовлені",
      description: "Скасовані або відхилені аналізи.",
      items: analyses.filter((item) => item.status === "Відмовлено"),
    },
  };

  const currentGroup = analysisGroups[activeFilter];

  const renderAnalysisCard = (item) => (
    <Card key={item.id} className="laborant-analysis-card">
      <div>
        <div className="laborant-analysis-header">
          <h3>{item.analysis.name}</h3>
          <Badge status={item.status} />
        </div>

        <div className="laborant-analysis-meta">
          <div>
            <span>Пацієнт</span>
            <strong>{item.patient.full_name}</strong>
          </div>

          <div>
            <span>Лікар</span>
            <strong>{item.doctor.full_name}</strong>
          </div>

          <div>
            <span>Дата</span>
            <strong>
              {new Date(item.date_prescribed).toLocaleString("uk-UA")}
            </strong>
          </div>
        </div>
      </div>

      {item.status === "Заплановано" && (
        <div className="laborant-analysis-actions">
          <Button
            variant="primary"
            onClick={() => setModal({ id: item.id, action: "confirm", item })}
          >
            Підтвердити
          </Button>

          <Button
            variant="danger"
            onClick={() => setModal({ id: item.id, action: "reject", item })}
          >
            Відхилити
          </Button>
        </div>
      )}

      {item.status === "Підтверджено" && (
        <div className="laborant-analysis-actions">
          {item.result_url && (
            <Button
              variant="outline"
              onClick={() => window.open(item.result_url, "_blank")}
            >
              Переглянути результат
            </Button>
          )}

          <Button
            variant="info"
            onClick={() => navigate(`/laborant/analyses/${item.id}`)}
          >
            Відкрити
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <main className="laborant-analyses-page">
      <div className="laborant-analyses-topbar">
        <Button variant="outline" onClick={() => navigate("/laborant/")}>
          Назад
        </Button>
      </div>

      <section className="laborant-analyses-hero">
        <h1>Аналізи пацієнтів</h1>
        <p>
          Переглядайте призначені аналізи, підтверджуйте виконання та працюйте з
          результатами лабораторних досліджень.
        </p>
      </section>

      <div className="laborant-filter-chips">
        <button
          className={
            activeFilter === "planned" ? "filter-chip active" : "filter-chip"
          }
          onClick={() => setActiveFilter("planned")}
        >
          Заплановані
        </button>
        <button
          className={
            activeFilter === "withoutResult"
              ? "filter-chip active"
              : "filter-chip"
          }
          onClick={() => setActiveFilter("withoutResult")}
        >
          Без результату
        </button>
        <button
          className={
            activeFilter === "withResult" ? "filter-chip active" : "filter-chip"
          }
          onClick={() => setActiveFilter("withResult")}
        >
          Є результат
        </button>
        <button
          className={
            activeFilter === "rejected" ? "filter-chip active" : "filter-chip"
          }
          onClick={() => setActiveFilter("rejected")}
        >
          Відмовлені
        </button>{" "}
      </div>

      <section className="laborant-analyses-section">
        <div className="section-heading">
          <h2>{currentGroup.title}</h2>
          <p>{currentGroup.description}</p>
        </div>

        {currentGroup.items.length === 0 ? (
          <Card>
            <p className="empty-text">Аналізів не знайдено.</p>
          </Card>
        ) : (
          <div className="laborant-analyses-grid">
            {currentGroup.items.map(renderAnalysisCard)}
          </div>
        )}
      </section>

      <Modal isOpen={!!modal} onClose={() => setModal(null)}>
        <div className="analysis-confirm-modal">
          <h2>
            {modal?.action === "confirm"
              ? "Підтвердити аналіз?"
              : "Відхилити аналіз?"}
          </h2>

          <p>
            {modal?.action === "confirm"
              ? "Ви дійсно хочете підтвердити виконання цього аналізу?"
              : "Ви дійсно хочете відхилити цей аналіз?"}
          </p>

          {modal?.item && (
            <div className="modal-analysis-info">
              <span>Пацієнт</span>
              <strong>{modal.item.patient.full_name}</strong>

              <span>Аналіз</span>
              <strong>{modal.item.analysis.name}</strong>
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
              variant={modal?.action === "confirm" ? "primary" : "danger"}
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

export default LaborantAnalysisList;

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import LaborantAnalysisResultForm from "../../components/laborant/analysis/LaborantAnalysisResultForm";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import Badge from "../../components/UI/Badge";
import Modal from "../../components/UI/Modal";

import "./AnalysisDetail.css";

const LaborantAnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);

  const [isEditingResult, setIsEditingResult] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const response = await api.get(`/laborant/analysis/${id}/`);

      setAnalysis(response.data);
    } catch (error) {
      console.error("Помилка при завантаженні аналізу", error);
      toast.error("Не вдалося завантажити аналіз");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDeleteResult = async () => {
    if (!analysis) return;

    try {
      setIsDeleting(true);

      await api.delete(`/laborant/analysis/${analysis.id}/result/delete/`);

      toast.success("Результат аналізу видалено");

      await fetchData();

      setDeleteModal(false);
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при видаленні результату";

      console.error("Помилка при видаленні результату", error);
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!analysis) {
    return <Loader text="Завантаження аналізу..." />;
  }

  const canEditResult = analysis.status === "Підтверджено";

  return (
    <main className="analysis-detail-page">
      <div className="analysis-detail-topbar">
        <Button
          variant="outline"
          onClick={() => navigate("/laborant/analyses/")}
        >
          Назад
        </Button>
      </div>

      <section className="analysis-detail-hero">
        <div>
          <h1>{analysis.analysis.name}</h1>

          <p>
            {analysis.patient.full_name} •{" "}
            {new Date(analysis.date_prescribed).toLocaleString("uk-UA")}
          </p>
        </div>

        <Badge status={analysis.status} />
      </section>

      <div className="analysis-detail-grid">
        <Card className="analysis-info-card">
          <h3>Інформація про аналіз</h3>

          <div className="analysis-info-list">
            <div>
              <span>Пацієнт</span>
              <strong>{analysis.patient.full_name}</strong>
            </div>

            <div>
              <span>Лікар</span>
              <strong>{analysis.doctor.full_name}</strong>
            </div>

            <div>
              <span>Аналіз</span>
              <strong>{analysis.analysis.name}</strong>
            </div>

            <div>
              <span>Дата проведення</span>
              <strong>
                {new Date(analysis.date_prescribed).toLocaleString("uk-UA")}
              </strong>
            </div>
          </div>
        </Card>

        <Card className="analysis-result-card">
          <h3>Результат</h3>

          {isEditingResult ? (
            <LaborantAnalysisResultForm
              analysisId={analysis.id}
              onCancel={() => setIsEditingResult(false)}
              onSuccess={async () => {
                await fetchData();
                setIsEditingResult(false);
              }}
            />
          ) : (
            <div className="analysis-result-content">
              {analysis.status === "Відмовлено" ? (
                <div className="result-state danger">
                  <span>Стан результату</span>
                  <strong>Аналіз було відхилено</strong>
                  <p>Для відхиленого аналізу результат не додається.</p>
                </div>
              ) : analysis.result_url ? (
                <>
                  <div className="result-state success">
                    <span>Стан результату</span>
                    <strong>Результат завантажено</strong>
                  </div>

                  <div className="analysis-result-actions">
                    <Button
                      variant="info"
                      onClick={() => window.open(analysis.result_url, "_blank")}
                    >
                      Переглянути результат
                    </Button>

                    {canEditResult && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditingResult(true)}
                        >
                          Оновити результат
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => setDeleteModal(true)}
                        >
                          Видалити результат
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="result-state warning">
                    <span>Стан результату</span>
                    <strong>Результат ще не додано</strong>
                    <p>Завантажте PDF-файл з результатом дослідження.</p>
                  </div>

                  {canEditResult && (
                    <Button
                      variant="info"
                      onClick={() => setIsEditingResult(true)}
                    >
                      Додати результат
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </Card>
      </div>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
        <div className="delete-result-modal">
          <h2>Видалити результат?</h2>

          <p>Ви дійсно хочете видалити PDF-файл результату цього аналізу?</p>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setDeleteModal(false)}
              disabled={isDeleting}
            >
              Скасувати
            </Button>

            <Button
              variant="danger"
              onClick={handleDeleteResult}
              disabled={isDeleting}
            >
              {isDeleting ? "Видалення..." : "Видалити"}
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default LaborantAnalysisDetail;

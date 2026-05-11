import { useState } from "react";
import toast from "react-hot-toast";

import AnalysisView from "./AnalysisView";
import AnalysisForm from "./AnalysisForm";
import api from "../../../api/axios";

import Card from "../../UI/Card";

import "./AnalysisTab.css";

const AnalysisTab = ({ visit, refresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const analyses = visit.history?.analyses || [];
  const isHistoryClosed = Boolean(visit?.history?.date_departure);

  const handleCancel = async (analysisId) => {
    if (isHistoryClosed) return;

    try {
      await api.patch(
        `/doctor/visit/${visit.id}/cancel-analysis/${analysisId}/`,
      );

      await refresh();

      toast.success("Аналіз скасовано");
    } catch (error) {
      const message = error.response?.data?.error || "Помилка при скасуванні";
      console.error("Помилка при скасуванні аналізу", error);
      toast.error(message);
    }
  };

  return (
    <Card className="analysis-tab-card">
      <div className="tab-section-heading">
        <h2>Аналізи</h2>
        <p>Призначені аналізи, лаборанти та статус виконання досліджень.</p>
      </div>

      {isHistoryClosed && (
        <div className="readonly-notice">
          Історію хвороби закрито. Редагування аналізів недоступне.
        </div>
      )}

      {isEditing && !isHistoryClosed ? (
        <AnalysisForm
          visit={visit}
          selectedAnalysis={selectedAnalysis}
          onCancel={() => {
            setIsEditing(false);
            setSelectedAnalysis(null);
          }}
          onSuccess={async () => {
            await refresh();
            setIsEditing(false);
            setSelectedAnalysis(null);
          }}
        />
      ) : (
        <AnalysisView
          analyses={analyses}
          isReadOnly={isHistoryClosed}
          onAdd={() => setIsEditing(true)}
          onEdit={(analysis) => {
            setSelectedAnalysis(analysis);
            setIsEditing(true);
          }}
          onCancel={handleCancel}
        />
      )}
    </Card>
  );
};

export default AnalysisTab;

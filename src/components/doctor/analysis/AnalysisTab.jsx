import { useState } from "react";
import AnalysisView from "./AnalysisView";
import AnalysisForm from "./AnalysisForm";
import api from "../../../api/axios";

const AnalysisTab = ({ visit, refresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const analyses = visit.history?.analyses || [];
  const isHistoryClosed = Boolean(visit?.history?.date_departure);

  const activeAnalyses = analyses.filter(
    (item) => item.status !== "Відмовлено",
  );

  const handleCancel = async (analysisId) => {
    if (isHistoryClosed) return;

    try {
      await api.patch(
        `/doctor/visit/${visit.id}/cancel-analysis/${analysisId}/`,
      );
      await refresh();
    } catch (error) {
      const message = error.response?.data?.error || "Помилка при скасуванні";
      console.error("Помилка при скасуванні аналізу", error);
      alert(message);
    }
  };

  return (
    <div>
      <h3>Аналізи</h3>

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
          analyses={activeAnalyses}
          isReadOnly={isHistoryClosed}
          onAdd={() => setIsEditing(true)}
          onEdit={(analysis) => {
            setSelectedAnalysis(analysis);
            setIsEditing(true);
          }}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AnalysisTab;

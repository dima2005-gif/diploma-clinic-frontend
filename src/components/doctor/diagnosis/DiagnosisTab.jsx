import { useState } from "react";
import toast from "react-hot-toast";

import DiagnosisView from "./DiagnosisView";
import DiagnosisForm from "./DiagnosisForm";
import api from "../../../api/axios";

import Card from "../../UI/Card";

import "./DiagnosisTab.css";

const DiagnosisTab = ({ visit, refresh }) => {
  const [isEditing, setIsEditing] = useState(false);

  const isHistoryClosed = Boolean(visit?.history?.date_departure);

  const handleDelete = async () => {
    if (isHistoryClosed) return;

    try {
      await api.delete(`/doctor/visit/${visit.id}/delete-diagnosis/`);

      await refresh();
      setIsEditing(false);

      toast.success("Діагноз видалено");
    } catch (error) {
      console.error("Помилка при видаленні діагнозу", error);
      toast.error("Не вдалося видалити діагноз");
    }
  };

  return (
    <Card className="diagnosis-tab-card">
      <div className="tab-section-heading">
        <h2>Діагноз</h2>
        <p>Діагноз пацієнта та висновок лікаря за цим прийомом.</p>
      </div>

      {isHistoryClosed && (
        <div className="readonly-notice">
          Історію хвороби закрито. Редагування діагнозу недоступне.
        </div>
      )}

      {isEditing && !isHistoryClosed ? (
        <DiagnosisForm
          visit={visit}
          onCancel={() => setIsEditing(false)}
          onSuccess={async () => {
            await refresh();
            setIsEditing(false);
          }}
        />
      ) : (
        <DiagnosisView
          visit={visit}
          isReadOnly={isHistoryClosed}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
        />
      )}
    </Card>
  );
};

export default DiagnosisTab;

import { useState } from "react";
import DiagnosisView from "./DiagnosisView";
import DiagnosisForm from "./DiagnosisForm";
import api from "../../../api/axios";

const DiagnosisTab = ({ visit, refresh }) => {
  const [isEditing, setIsEditing] = useState(false);

  const isHistoryClosed = Boolean(visit?.history?.date_departure);

  const handleDelete = async () => {
    if (isHistoryClosed) return;

    try {
      await api.delete(`/doctor/visit/${visit.id}/delete-diagnosis/`);
      await refresh();
      setIsEditing(false);
    } catch (error) {
      console.error("Помилка при видаленні діагнозу", error);
    }
  };

  return (
    <div>
      <h3>Діагноз</h3>

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
    </div>
  );
};

export default DiagnosisTab;

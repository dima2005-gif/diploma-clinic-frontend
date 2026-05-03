import { useState } from "react";
import MedicinesView from "./MedicinewView.jsx";
import MedicinesForm from "./MedicineForm.jsx";
import api from "../../../api/axios";

const MedicinesTab = ({ visit, refresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const medicines = visit?.history?.medicines || [];
  const isHistoryClosed = Boolean(visit?.history?.date_departure);

  const handleDelete = async (medicineId) => {
    if (isHistoryClosed) return;

    try {
      await api.delete(
        `/doctor/visit/${visit.id}/${medicineId}/delete-medicines/`,
      );
      await refresh();
    } catch (error) {
      console.error("Помилка при видаленні ліків", error);
    }
  };

  return (
    <div>
      <h3>Ліки</h3>

      {isEditing && !isHistoryClosed ? (
        <MedicinesForm
          visit={visit}
          selectedMedicine={selectedMedicine}
          onCancel={() => {
            setIsEditing(false);
            setSelectedMedicine(null);
          }}
          onSuccess={async () => {
            await refresh();
            setIsEditing(false);
            setSelectedMedicine(null);
          }}
        />
      ) : (
        <MedicinesView
          medicines={medicines}
          isReadOnly={isHistoryClosed}
          onAdd={() => setIsEditing(true)}
          onEdit={(medicine) => {
            setSelectedMedicine(medicine);
            setIsEditing(true);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default MedicinesTab;

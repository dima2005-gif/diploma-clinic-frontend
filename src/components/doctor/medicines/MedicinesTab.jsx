import { useState } from "react";
import toast from "react-hot-toast";

import MedicinesView from "./MedicinewView.jsx";
import MedicinesForm from "./MedicineForm.jsx";
import api from "../../../api/axios";

import Card from "../../UI/Card";

import "./MedicinesTab.css";

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

      toast.success("Ліки видалено");
    } catch (error) {
      console.error("Помилка при видаленні ліків", error);
      toast.error("Не вдалося видалити ліки");
    }
  };

  return (
    <Card className="medicines-tab-card">
      <div className="tab-section-heading">
        <h2>Ліки</h2>
        <p>Призначені лікарські засоби та рекомендації щодо застосування.</p>
      </div>

      {isHistoryClosed && (
        <div className="readonly-notice">
          Історію хвороби закрито. Редагування ліків недоступне.
        </div>
      )}

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
    </Card>
  );
};

export default MedicinesTab;

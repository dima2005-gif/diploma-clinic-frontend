import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../../api/axios";

import Button from "../../UI/Button";

const MedicineForm = ({ visit, selectedMedicine, onCancel, onSuccess }) => {
  const [medicineList, setMedicineList] = useState([]);
  const [medicineId, setMedicineId] = useState(
    selectedMedicine?.medicine?.id || "",
  );
  const [recipe, setRecipe] = useState(selectedMedicine?.recipe || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await api.get("/medicines/");
        setMedicineList(response.data || []);
      } catch (error) {
        console.error("Помилка при завантаженні ліків", error);
        toast.error("Не вдалося завантажити список ліків");
      }
    };

    fetchMedicines();
  }, []);

  const handleSubmit = async () => {
    if (!medicineId) {
      toast("Оберіть ліки");
      return;
    }

    if (!recipe.trim()) {
      toast("Введіть рецепт");
      return;
    }

    try {
      setIsSaving(true);

      if (selectedMedicine) {
        await api.put(
          `/doctor/visit/${visit.id}/${selectedMedicine.id}/update-medicines/`,
          {
            medicine_id: Number(medicineId),
            recipe,
          },
        );

        toast.success("Ліки оновлено");
      } else {
        await api.post(`/doctor/visit/${visit.id}/add-medicines/`, {
          medicine_id: Number(medicineId),
          recipe,
        });

        toast.success("Ліки додано");
      }

      await onSuccess();
    } catch (error) {
      const message = error.response?.data?.error || "Помилка при збереженні";
      console.error("Помилка при збереженні ліків", error);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="medicine-form">
      <div className="form-group">
        <label>Ліки</label>

        <select
          value={medicineId}
          onChange={(e) => setMedicineId(e.target.value)}
        >
          <option value="">Оберіть ліки</option>

          {medicineList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Рецепт</label>

        <textarea
          placeholder="Введіть рецепт або рекомендації щодо застосування..."
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
        />
      </div>

      <div className="medicine-form-actions">
        <Button variant="info" onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "Збереження..." : "Зберегти"}
        </Button>

        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Скасувати
        </Button>
      </div>
    </div>
  );
};

export default MedicineForm;

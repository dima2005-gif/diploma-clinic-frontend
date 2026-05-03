import { useEffect, useState } from "react";
import api from "../../../api/axios";

const MedicineForm = ({ visit, selectedMedicine, onCancel, onSuccess }) => {
  const [medicineList, setMedicineList] = useState([]);
  const [medicineId, setMedicineId] = useState(
    selectedMedicine?.medicine?.id || "",
  );
  const [recipe, setRecipe] = useState(selectedMedicine?.recipe || "");

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await api.get("/medicines/");
        setMedicineList(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні ліків", error);
      }
    };

    fetchMedicines();
  }, []);

  const handleSubmit = async () => {
    if (!medicineId) {
      alert("Оберіть ліки");
      return;
    }

    if (!recipe.trim()) {
      alert("Введіть рецепт");
      return;
    }

    try {
      if (selectedMedicine) {
        await api.put(
          `/doctor/visit/${visit.id}/${selectedMedicine.id}/update-medicines/`,
          {
            medicine_id: Number(medicineId),
            recipe,
          },
        );
      } else {
        await api.post(`/doctor/visit/${visit.id}/add-medicines/`, {
          medicine_id: Number(medicineId),
          recipe,
        });
      }

      await onSuccess();
    } catch (error) {
      const message = error.response?.data?.error || "Помилка при збереженні";
      console.error("Помилка при збереженні ліків", error);
      alert(message);
    }
  };

  return (
    <div>
      <h3>{selectedMedicine ? "Оновити ліки" : "Додати ліки"}</h3>

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

      <br />

      <textarea
        placeholder="Рецепт"
        value={recipe}
        onChange={(e) => setRecipe(e.target.value)}
      />

      <br />

      <button onClick={handleSubmit}>Зберегти</button>
      <button onClick={onCancel}>Скасувати</button>
    </div>
  );
};

export default MedicineForm;

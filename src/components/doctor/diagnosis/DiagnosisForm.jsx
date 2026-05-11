import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../../api/axios";

import Button from "../../UI/Button";

const DiagnosisForm = ({ visit, onCancel, onSuccess }) => {
  const history = visit.history || null;

  const [diagnosis, setDiagnosis] = useState([]);
  const [diagnosisId, setDiagnosisId] = useState(history?.diagnosis?.id || "");
  const [conclusion, setConclusion] = useState(history?.conclusion || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await api.get("/diagnosis/");
        setDiagnosis(response.data || []);
      } catch (error) {
        console.error("Помилка при завантаженні діагнозів", error);
        toast.error("Не вдалося завантажити список діагнозів");
      }
    };

    fetchDiagnosis();
  }, []);

  const handleSubmit = async () => {
    if (!diagnosisId) {
      toast("Оберіть діагноз");
      return;
    }

    try {
      setIsSaving(true);

      if (history?.diagnosis) {
        await api.put(`/doctor/visit/${visit.id}/update-diagnosis/`, {
          diagnosis_id: Number(diagnosisId),
          conclusion,
        });

        toast.success("Діагноз оновлено");
      } else {
        await api.post(`/doctor/visit/${visit.id}/add-diagnosis/`, {
          diagnosis_id: Number(diagnosisId),
          conclusion: conclusion || null,
        });

        toast.success("Діагноз додано");
      }

      await onSuccess();
    } catch (error) {
      console.error("Помилка при збереженні діагнозу", error);
      toast.error("Не вдалося зберегти діагноз");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="diagnosis-form">
      <div className="form-group">
        <label>Діагноз</label>

        <select
          value={diagnosisId}
          onChange={(e) => setDiagnosisId(e.target.value)}
        >
          <option value="">Оберіть діагноз</option>

          {diagnosis.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Висновок</label>

        <textarea
          placeholder="Введіть висновок лікаря..."
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
        />
      </div>

      <div className="diagnosis-form-actions">
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

export default DiagnosisForm;

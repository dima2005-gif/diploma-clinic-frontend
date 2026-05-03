import { useEffect, useState } from "react";
import api from "../../../api/axios";

const DiagnosisForm = ({ visit, onCancel, onSuccess }) => {
  const history = visit.history || null;
  const [diagnosis, setDiagnosis] = useState([]);
  const [diagnosisId, setDiagnosisId] = useState(history?.diagnosis?.id || "");
  const [conclusion, setConclusion] = useState(history?.conclusion || "");

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await api.get("/diagnosis/");
        setDiagnosis(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні діагнозів", error);
      }
    };
    fetchDiagnosis();
  }, []);

  const handleSubmit = async () => {
    if (!diagnosisId) {
      alert("Оберіть діагноз");
      return;
    }

    try {
      if (history?.diagnosis) {
        await api.put(`/doctor/visit/${visit.id}/update-diagnosis/`, {
          diagnosis_id: diagnosisId,
          conclusion: conclusion,
        });
      } else {
        await api.post(`/doctor/visit/${visit.id}/add-diagnosis/`, {
          diagnosis_id: Number(diagnosisId),
          conclusion: conclusion || null,
        });
      }
      await onSuccess();
    } catch (error) {
      console.error("Помилка при збереженні діагнозу", error);
    }
  };
  return (
    <div>
      <h3>Діагноз</h3>
      <select
        value={diagnosisId}
        onChange={(e) => setDiagnosisId(Number(e.target.value))}
      >
        <option value="">Оберіть діагноз</option>
        {diagnosis.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      <h3>Висновок</h3>
      <br />
      <textarea
        placeholder="Висновок"
        value={conclusion}
        onChange={(e) => setConclusion(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Зберегти</button>
      <button onClick={onCancel}>Скасувати</button>
    </div>
  );
};

export default DiagnosisForm;

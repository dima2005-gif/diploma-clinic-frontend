import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../../api/axios";

import Button from "../../UI/Button";

const AnalysisForm = ({ visit, selectedAnalysis, onCancel, onSuccess }) => {
  const [analysisList, setAnalysisList] = useState([]);
  const [assistants, setAssistants] = useState([]);

  const [analysisId, setAnalysisId] = useState(
    selectedAnalysis?.analysis?.id || "",
  );

  const [assistantId, setAssistantId] = useState(
    selectedAnalysis?.laboratory_assistant?.id || "",
  );

  const [datePrescribed, setDatePrescribed] = useState(
    selectedAnalysis?.date_prescribed
      ? selectedAnalysis.date_prescribed.slice(0, 16)
      : "",
  );

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analysesResponse, labsResponse] = await Promise.all([
          api.get("/analysis/"),
          api.get("/laborant-list/"),
        ]);

        setAnalysisList(analysesResponse.data || []);
        setAssistants(labsResponse.data || []);
      } catch (error) {
        console.error("Помилка при завантаженні списків", error);
        toast.error("Не вдалося завантажити дані для аналізу");
      }
    };

    fetchData();
  }, []);

  const now = new Date();

  const minDateTime = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(
    now.getHours(),
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const handleSubmit = async () => {
    if (!analysisId || !assistantId || !datePrescribed) {
      toast("Заповніть всі поля");
      return;
    }

    try {
      setIsSaving(true);

      if (selectedAnalysis) {
        await api.put(
          `/doctor/visit/${visit.id}/update-analysis/${selectedAnalysis.id}/`,
          {
            analysis_id: Number(analysisId),
            laboratory_assistant_id: Number(assistantId),
            date_prescribed: datePrescribed,
          },
        );

        toast.success("Аналіз оновлено");
      } else {
        await api.post(`/doctor/visit/${visit.id}/add-analysis/`, {
          analysis_id: Number(analysisId),
          laboratory_assistant_id: Number(assistantId),
          date_prescribed: datePrescribed,
        });

        toast.success("Аналіз призначено");
      }

      await onSuccess();
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при збереженні аналізу";

      console.error("Помилка при збереженні аналізу", error);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="analysis-form">
      <div className="form-group">
        <label>Аналіз</label>

        <select
          value={analysisId}
          onChange={(e) => setAnalysisId(e.target.value)}
        >
          <option value="">Оберіть аналіз</option>

          {analysisList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Лаборант</label>

        <select
          value={assistantId}
          onChange={(e) => setAssistantId(e.target.value)}
        >
          <option value="">Оберіть лаборанта</option>

          {assistants.map((item) => (
            <option key={item.id} value={item.id}>
              {item.last_name} {item.first_name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Дата та час</label>

        <input
          type="datetime-local"
          value={datePrescribed}
          min={minDateTime}
          onChange={(e) => setDatePrescribed(e.target.value)}
        />
      </div>

      <div className="analysis-form-actions">
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

export default AnalysisForm;

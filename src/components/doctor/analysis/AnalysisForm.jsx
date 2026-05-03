import { useEffect, useState } from "react";
import api from "../../../api/axios";

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
    selectedAnalysis?.date_prescribed || "",
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyses = await api.get("/analysis/");
        const labs = await api.get("/laborant/");

        setAnalysisList(analyses.data);
        setAssistants(labs.data);
      } catch (error) {
        console.error("Помилка при завантаженні списків", error);
      }
    };

    fetchData();
  }, []);



  const now = new Date();

  const minDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const handleSubmit = async () => {
    if (!analysisId || !assistantId || !datePrescribed) {
      alert("Заповніть всі поля");
      return;
    }

    try {
      if (selectedAnalysis) {
        await api.put(
          `/doctor/visit/${visit.id}/update-analysis/${selectedAnalysis.id}/`,
          {
            analysis_id: Number(analysisId),
            laboratory_assistant_id: Number(assistantId),
            date_prescribed: datePrescribed,
          },
        );
      } else {
        await api.post(`/doctor/visit/${visit.id}/add-analysis/`, {
          analysis_id: Number(analysisId),
          laboratory_assistant_id: Number(assistantId),
          date_prescribed: datePrescribed,
        });
      }

      await onSuccess();
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при збереженні аналізу";
      console.error("Помилка при збереженні аналізу", error);
      alert(message);
    }
  };

  return (
    <div>
      <h3>{selectedAnalysis ? "Оновити аналіз" : "Призначити аналіз"}</h3>

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

      <br />

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

      <br />

      <input
        type="datetime-local"
        value={datePrescribed}
        min={minDateTime}
        onChange={(e) => setDatePrescribed(e.target.value)}
      />

      <br />

      <button onClick={handleSubmit}>Зберегти</button>
      <button onClick={onCancel}>Скасувати</button>
    </div>
  );
};

export default AnalysisForm;

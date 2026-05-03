import { useState } from "react";
import api from "../../../api/axios";

const LaborantAnalysisResultForm = ({ analysisId, onCancel, onSuccess }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    if (!file) {
      alert("Оберіть PDF-файл");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Можна завантажити лише PDF-файл");
      return;
    }

    const formData = new FormData();
    formData.append("result", file);

    try {
      await api.patch(`/laborant/analysis/${analysisId}/result/`, formData);

      await onSuccess();
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при збереженні результату";
      console.error("Помилка при збереженні результату", error);
      alert(message);
    }
  };

  return (
    <div>
      <h3>Оновити результат аналізу</h3>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />

      <button onClick={handleSubmit}>Зберегти</button>
      <button onClick={onCancel}>Відміна</button>
    </div>
  );
};

export default LaborantAnalysisResultForm;

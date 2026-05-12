import { useState } from "react";
import toast from "react-hot-toast";

import api from "../../../api/axios";

import Button from "../../UI/Button";

const LaborantAnalysisResultForm = ({ analysisId, onCancel, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      toast("Оберіть PDF-файл");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Можна завантажити лише PDF-файл");
      return;
    }

    const formData = new FormData();
    formData.append("result", file);

    try {
      setIsSaving(true);

      await api.patch(`/laborant/analysis/${analysisId}/result/`, formData);

      toast.success("Результат аналізу збережено");

      await onSuccess();
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при збереженні результату";

      console.error("Помилка при збереженні результату", error);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="result-form">
      <div className="result-form-group">
        <label>PDF-файл результату</label>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {file && <p className="selected-file">Обрано: {file.name}</p>}
      </div>

      <div className="result-form-actions">
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

export default LaborantAnalysisResultForm;

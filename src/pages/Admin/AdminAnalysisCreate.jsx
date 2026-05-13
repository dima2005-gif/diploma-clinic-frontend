import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";

import "./AdminAnalysisCreate.css";

const AdminAnalysisCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: null,
    }));
  };

  const getError = (field) => {
    const error = errors[field];

    if (Array.isArray(error)) return error[0];

    return error;
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);

      const response = await api.post("/admin/analysis/create/", {
        ...form,
        price: Number(form.price),
      });

      toast.success(response.data.message || "Аналіз створено");

      navigate("/administrator/analyses/");
    } catch (error) {
      console.error("Помилка при створенні аналізу", error);

      if (error.response?.data) {
        setErrors(error.response.data);
        toast.error("Перевірте правильність заповнення полів");
      } else {
        toast.error("Помилка при створенні аналізу");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="admin-analysis-create-page">
      <div className="admin-analysis-create-topbar">
        <Button
          variant="outline"
          onClick={() => navigate("/administrator/analyses/")}
        >
          Назад
        </Button>
      </div>

      <section className="admin-analysis-create-hero">
        <h1>Додати аналіз</h1>

        <p>
          Створення нового лабораторного аналізу з описом та вартістю
          дослідження.
        </p>
      </section>

      <Card className="admin-analysis-create-card">
        <div className="form-section">
          <div className="form-section-heading">
            <h2>Основна інформація</h2>
            <p>Назва, опис та вартість лабораторного аналізу.</p>
          </div>

          <div className="admin-analysis-form-grid">
            <div className="form-group">
              <label>Назва</label>
              <input name="name" value={form.name} onChange={handleChange} />
              {getError("name") && (
                <p className="field-error">{getError("name")}</p>
              )}
            </div>

            <div className="form-group">
              <label>Вартість</label>
              <input
                type="number"
                name="price"
                min="0"
                step="1"
                value={form.price}
                onChange={handleChange}
              />
              {getError("price") && (
                <p className="field-error">{getError("price")}</p>
              )}
            </div>

            <div className="form-group full">
              <label>Опис</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />
              {getError("description") && (
                <p className="field-error">{getError("description")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="admin-analysis-create-actions">
          <Button
            variant="outline"
            onClick={() => navigate("/administrator/analyses/")}
          >
            Скасувати
          </Button>

          <Button variant="info" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Створення..." : "Створити"}
          </Button>
        </div>
      </Card>
    </main>
  );
};

export default AdminAnalysisCreate;

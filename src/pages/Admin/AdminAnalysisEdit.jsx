import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./AdminAnalysisEdit.css";

const AdminAnalysisEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/admin/analysis/${id}/`);

        setForm({
          name: response.data.name || "",
          description: response.data.description || "",
          price: response.data.price ? Number(response.data.price) : "",
        });
      } catch (error) {
        console.error("Помилка при завантаженні аналізу", error);
        toast.error("Не вдалося завантажити аналіз");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

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

      await api.patch(`/admin/analysis/${id}/update/`, {
        ...form,
        price: Number(form.price),
      });

      toast.success("Аналіз оновлено");

      navigate(`/administrator/analyses/${id}/`);
    } catch (error) {
      console.error("Помилка при оновленні аналізу", error);

      if (error.response?.data) {
        setErrors(error.response.data);
        toast.error("Перевірте правильність заповнення полів");
      } else {
        toast.error("Помилка при оновленні аналізу");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !form) {
    return <Loader text="Завантаження аналізу..." />;
  }

  return (
    <main className="admin-analysis-edit-page">
      <div className="admin-analysis-edit-topbar">
        <Button
          variant="outline"
          onClick={() => navigate(`/administrator/analyses/${id}/`)}
        >
          Назад
        </Button>
      </div>

      <section className="admin-analysis-edit-hero">
        <h1>Редагувати аналіз</h1>

        <p>
          Оновлення назви, опису та вартості лабораторного дослідження.
        </p>
      </section>

      <Card className="admin-analysis-edit-card">
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

        <div className="admin-analysis-edit-actions">
          <Button
            variant="outline"
            onClick={() => navigate(`/administrator/analyses/${id}/`)}
          >
            Скасувати
          </Button>

          <Button variant="info" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Збереження..." : "Зберегти"}
          </Button>
        </div>
      </Card>
    </main>
  );
};

export default AdminAnalysisEdit;

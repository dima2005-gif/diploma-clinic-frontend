import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./AdminServiceCreate.css";

const AdminServiceCreate = () => {
  const navigate = useNavigate();

  const [positions, setPositions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    position_ids: [],
  });

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await api.get("/admin/doctor-position/");
        setPositions(response.data || []);
      } catch (error) {
        console.error("Помилка при завантаженні посад", error);
        toast.error("Не вдалося завантажити посади");
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

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

  const handlePositionChange = (positionId) => {
    setForm((prev) => {
      const exists = prev.position_ids.includes(positionId);

      return {
        ...prev,
        position_ids: exists
          ? prev.position_ids.filter((id) => id !== positionId)
          : [...prev.position_ids, positionId],
      };
    });

    setErrors((prev) => ({
      ...prev,
      position_ids: null,
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

      const response = await api.post("/admin/service/create/", {
        ...form,
        price: Number(form.price),
      });

      toast.success(response.data.message || "Послугу створено");

      navigate("/administrator/services/");
    } catch (error) {
      console.error("Помилка при створенні послуги", error);

      if (error.response?.data) {
        setErrors(error.response.data);
        toast.error("Перевірте правильність заповнення полів");
      } else {
        toast.error("Помилка при створенні послуги");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Завантаження форми..." />;
  }

  return (
    <main className="admin-service-create-page">
      <div className="admin-service-create-topbar">
        <Button
          variant="outline"
          onClick={() => navigate("/administrator/services/")}
        >
          Назад
        </Button>
      </div>

      <section className="admin-service-create-hero">
        <h1>Додати послугу</h1>

        <p>
          Створення нової медичної послуги, налаштування її вартості та посад,
          які можуть її надавати.
        </p>
      </section>

      <Card className="admin-service-create-card">
        <div className="form-section">
          <div className="form-section-heading">
            <h2>Основна інформація</h2>
            <p>Назва, опис та вартість медичної послуги.</p>
          </div>

          <div className="admin-service-form-grid">
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

        <div className="form-section">
          <div className="form-section-heading">
            <h2>Посади</h2>
            <p>Оберіть посади лікарів, які можуть надавати цю послугу.</p>
          </div>

          {positions.length === 0 ? (
            <Card>
              <p className="empty-text">Посади не знайдено.</p>
            </Card>
          ) : (
            <div className="service-position-chips">
              {positions.map((position) => {
                const selected = form.position_ids.includes(position.id);

                return (
                  <button
                    key={position.id}
                    type="button"
                    className={
                      selected ? "service-position-chip active" : "service-position-chip"
                    }
                    onClick={() => handlePositionChange(position.id)}
                  >
                    {position.name}
                  </button>
                );
              })}
            </div>
          )}

          {getError("position_ids") && (
            <p className="field-error">{getError("position_ids")}</p>
          )}
        </div>

        <div className="admin-service-create-actions">
          <Button
            variant="outline"
            onClick={() => navigate("/administrator/services/")}
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

export default AdminServiceCreate;

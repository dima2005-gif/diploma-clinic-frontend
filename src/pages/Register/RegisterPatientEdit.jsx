import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./RegisterPatientCreate.css";

const RegisterPatientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientResponse = await api.get(`/register/${id}/`);
        setForm({
          first_name: patientResponse.data.first_name || "",
          last_name: patientResponse.data.last_name || "",
          middle_name: patientResponse.data.middle_name || "",
          date_of_birth: patientResponse.data.date_of_birth || "",
          phone_number: patientResponse.data.phone_number || "",
          email: patientResponse.data.email || "",
          address: patientResponse.data.address || "",
          sex: patientResponse.data.sex || "",
          weight: patientResponse.data.weight || "",
          height: patientResponse.data.height || "",
          blood_group: patientResponse.data.blood_group || "",
        });
      } catch (error) {
        console.error("Помилка при завантаженні пацієнта", error);
        toast.error("Не вдалося завантажити дані пацієнта");
      }
    };

    fetchData();
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

      await api.patch(`/register/${id}/update/`, {
        ...form,
        weight: Number(form.weight),
        height: Number(form.height),
      });

      toast.success("Дані пацієнта оновлено");

      navigate(`/register/${id}/`);
    } catch (error) {
      console.error("Помилка при оновленні пацієнта", error);

      if (error.response?.data) {
        setErrors(error.response.data);
        toast.error("Перевірте правильність заповнення полів");
      } else {
        toast.error("Помилка при оновленні пацієнта");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!form) {
    return <Loader text="Завантаження форми..." />;
  }

  return (
    <main className="register-create-page">
      <div className="register-create-topbar">
        <Button variant="outline" onClick={() => navigate(`/register/${id}/`)}>
          Назад
        </Button>
      </div>

      <section className="register-create-hero">
        <h1>Редагування пацієнта</h1>

        <p>Оновлення особистих, контактних та медичних даних пацієнта.</p>
      </section>

      <Card className="register-create-card">
        <div className="form-section">
          <div className="form-section-heading">
            <h2>Особисті дані</h2>
            <p>ПІБ, дата народження та стать пацієнта.</p>
          </div>

          <div className="register-form-grid">
            <div className="form-group">
              <label>Прізвище</label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
              />
              {getError("last_name") && (
                <p className="field-error">{getError("last_name")}</p>
              )}
            </div>

            <div className="form-group">
              <label>Ім'я</label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
              />
              {getError("first_name") && (
                <p className="field-error">{getError("first_name")}</p>
              )}
            </div>

            <div className="form-group">
              <label>По батькові</label>
              <input
                name="middle_name"
                value={form.middle_name}
                onChange={handleChange}
              />
              {getError("middle_name") && (
                <p className="field-error">{getError("middle_name")}</p>
              )}
            </div>

            <div className="form-group">
              <label>Дата народження</label>
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                max={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
              />
              {getError("date_of_birth") && (
                <p className="field-error">{getError("date_of_birth")}</p>
              )}
            </div>

            <div className="form-group">
              <label>Стать</label>
              <select name="sex" value={form.sex} onChange={handleChange}>
                <option value="">Оберіть стать</option>
                <option value="Чоловік">Чоловік</option>
                <option value="Жінка">Жінка</option>
              </select>
              {getError("sex") && (
                <p className="field-error">{getError("sex")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-heading">
            <h2>Контактні дані</h2>
            <p>Телефон, електронна пошта та адреса проживання.</p>
          </div>

          <div className="register-form-grid">
            <div className="form-group">
              <label>Номер телефону</label>
              <input
                name="phone_number"
                value={form.phone_number}
                placeholder="+380501112233"
                onChange={handleChange}
              />
              {getError("phone_number") && (
                <p className="field-error">{getError("phone_number")}</p>
              )}
            </div>

            <div className="form-group">
              <label>Електронна пошта</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {getError("email") && (
                <p className="field-error">{getError("email")}</p>
              )}
            </div>

            <div className="form-group full">
              <label>Адреса</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
              />
              {getError("address") && (
                <p className="field-error">{getError("address")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-heading">
            <h2>Медичні дані</h2>
            <p>Фізичні показники та група крові пацієнта.</p>
          </div>

          <div className="register-form-grid">
            <div className="form-group">
              <label>Вага</label>
              <input
                type="number"
                name="weight"
                min="1"
                step="0.1"
                value={form.weight}
                onChange={handleChange}
              />
              {getError("weight") && (
                <p className="field-error">{getError("weight")}</p>
              )}
            </div>

            <div className="form-group">
              <label>Зріст</label>
              <input
                type="number"
                name="height"
                min="1"
                value={form.height}
                onChange={handleChange}
              />
              {getError("height") && (
                <p className="field-error">{getError("height")}</p>
              )}
            </div>

            <div className="form-group">
              <label>Група крові</label>
              <select
                name="blood_group"
                value={form.blood_group}
                onChange={handleChange}
              >
                <option value="">Оберіть групу крові</option>
                <option value="I Rh+">I Rh+</option>
                <option value="I Rh-">I Rh-</option>
                <option value="II Rh+">II Rh+</option>
                <option value="II Rh-">II Rh-</option>
                <option value="III Rh+">III Rh+</option>
                <option value="III Rh-">III Rh-</option>
                <option value="IV Rh+">IV Rh+</option>
                <option value="IV Rh-">IV Rh-</option>
              </select>
              {getError("blood_group") && (
                <p className="field-error">{getError("blood_group")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="register-create-actions">
          <Button
            variant="outline"
            onClick={() => navigate(`/register/${id}/`)}
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

export default RegisterPatientEdit;

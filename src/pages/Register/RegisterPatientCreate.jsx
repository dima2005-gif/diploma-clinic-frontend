import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./RegisterPatientCreate.css";

const RegisterPatientCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    date_of_birth: "",
    phone_number: "",
    email: "",
    address: "",
    sex: "",
    weight: "",
    height: "",
    blood_group: "",
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchRegisterData = async () => {
      try {
        const response = await api.get("/register/dashboard/");
        setRegisterData(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні реєстратора", error);
      }
    };

    fetchRegisterData();
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

  const getError = (field) => {
    const error = errors[field];

    if (Array.isArray(error)) return error[0];

    return error;
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);

      const response = await api.post("/register/create/", {
        ...form,
        weight: Number(form.weight),
        height: Number(form.height),
      });

      toast.success(response.data.message || "Пацієнта створено");

      navigate("/register/");
    } catch (error) {
      console.error("Помилка при створенні пацієнта", error);

      if (error.response?.data) {
        setErrors(error.response.data);
        toast.error("Перевірте правильність заповнення полів");
      } else {
        toast.error("Помилка при створенні пацієнта");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="register-create-page">
      <div className="register-create-topbar">
        <Button variant="outline" onClick={() => navigate("/register/")}>
          Назад
        </Button>
      </div>

      <section className="register-create-hero">
        <h1>Додати пацієнта</h1>

        <p>
          Створення нової картки пацієнта з особистими, контактними та медичними
          даними.
        </p>
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
              <label>Вага (кг)</label>
              <input
                type="number"
                name="weight"
                min="1"
                value={form.weight}
                onChange={handleChange}
              />
              {getError("weight") && (
                <p className="field-error">{getError("weight")}</p>
              )}
            </div>

            <div className="form-group">
              <label>Зріст (см)</label>
              <input
                type="number"
                name="height"
                min="1"
                value={form.height}
                onChange={handleChange}
              />{" "}
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
          <Button variant="outline" onClick={() => navigate("/register/")}>
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

export default RegisterPatientCreate;

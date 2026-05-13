import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./AdminEmployeeUpdate.css";

const AdminEmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [positions, setPositions] = useState([]);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeResponse, positionsResponse] = await Promise.all([
          api.get(`/admin/employee/${id}/`),
          api.get("/admin/position/"),
        ]);

        const employee = employeeResponse.data;
        const positionsData = positionsResponse.data || [];

        setPositions(positionsData);

        const currentPosition = positionsData.find(
          (position) => position.name === employee.position,
        );

        setForm({
          first_name: employee.first_name || "",
          last_name: employee.last_name || "",
          middle_name: employee.middle_name || "",
          position_id: currentPosition?.id || "",
          date_of_birth: employee.date_of_birth || "",
          phone_number: employee.phone_number || "",
          address: employee.address || "",
          email: employee.email || "",
          sex: employee.sex || "",
          marital_status: employee.marital_status || "",
          education: employee.education || "",
          date_of_hire: employee.date_of_hire || "",
        });
      } catch (error) {
        console.error("Помилка при завантаженні співробітника", error);
        toast.error("Не вдалося завантажити співробітника");
      } finally {
        setLoading(false);
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

      await api.patch(`/admin/employee/${id}/update/`, {
        ...form,
        position_id: Number(form.position_id),
      });

      toast.success("Дані співробітника оновлено");

      navigate(`/administrator/employees/${id}/`);
    } catch (error) {
      console.error("Помилка при оновленні співробітника", error);

      if (error.response?.data) {
        setErrors(error.response.data);
        toast.error("Перевірте правильність заповнення полів");
      } else {
        toast.error("Помилка при оновленні співробітника");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !form) {
    return <Loader text="Завантаження співробітника..." />;
  }

  return (
    <main className="admin-employee-edit-page">
      <div className="admin-employee-edit-topbar">
        <Button
          variant="outline"
          onClick={() => navigate(`/administrator/employees/${id}/`)}
        >
          Назад
        </Button>
      </div>

      <section className="admin-employee-edit-hero">
        <h1>Редагувати співробітника</h1>

        <p>
          Оновлення особистих, контактних та службових даних працівника
          поліклініки.
        </p>
      </section>

      <Card className="admin-employee-edit-card">
        <div className="form-section">
          <div className="form-section-heading">
            <h2>Особисті дані</h2>
            <p>ПІБ, дата народження та стать співробітника.</p>
          </div>

          <div className="admin-employee-form-grid">
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

            <div className="form-group">
              <label>Сімейний стан</label>
              <select
                name="marital_status"
                value={form.marital_status}
                onChange={handleChange}
              >
                <option value="">Оберіть сімейний стан</option>
                <option value="Одружений">Одружений</option>
                <option value="Неодружений">Неодружений</option>
                <option value="Одружена">Одружена</option>
                <option value="Неодружена">Неодружена</option>
              </select>
              {getError("marital_status") && (
                <p className="field-error">{getError("marital_status")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-heading">
            <h2>Контактні дані</h2>
            <p>Телефон, електронна пошта та адреса проживання.</p>
          </div>

          <div className="admin-employee-form-grid">
            <div className="form-group">
              <label>Номер телефону</label>
              <input
                name="phone_number"
                value={form.phone_number}
                placeholder="+380501234567"
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
            <h2>Службові дані</h2>
            <p>Посада, освіта та дата прийняття на роботу.</p>
          </div>

          <div className="admin-employee-form-grid">
            <div className="form-group">
              <label>Посада</label>
              <select
                name="position_id"
                value={form.position_id}
                onChange={handleChange}
              >
                <option value="">Оберіть посаду</option>

                {positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.name}
                  </option>
                ))}
              </select>
              {getError("position_id") && (
                <p className="field-error">{getError("position_id")}</p>
              )}
            </div>

            <div className="form-group">
              <label>Освіта</label>
              <select
                name="education"
                value={form.education}
                onChange={handleChange}
              >
                <option value="">Оберіть освіту</option>
                <option value="Вища освіта">Вища освіта</option>
                <option value="Середня професійна">Середня професійна</option>
                <option value="Базова вища освіта">Базова вища освіта</option>
                <option value="Неповна вища освіта">Неповна вища освіта</option>
              </select>
              {getError("education") && (
                <p className="field-error">{getError("education")}</p>
              )}
            </div>

            <div className="form-group">
              <label>Дата найму</label>
              <input
                type="date"
                name="date_of_hire"
                value={form.date_of_hire}
                max={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
              />
              {getError("date_of_hire") && (
                <p className="field-error">{getError("date_of_hire")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="admin-employee-edit-actions">
          <Button
            variant="outline"
            onClick={() => navigate(`/administrator/employees/${id}/`)}
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

export default AdminEmployeeEdit;

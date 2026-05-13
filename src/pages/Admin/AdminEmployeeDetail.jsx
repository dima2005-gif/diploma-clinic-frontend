import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import Modal from "../../components/UI/Modal";

import "./AdminEmployeeDetail.css";

const emptyScheduleForm = {
  day_of_week: "",
  start_time: "",
  end_time: "",
};

const AdminEmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [scheduleModal, setScheduleModal] = useState(null);
  const [scheduleForm, setScheduleForm] = useState(emptyScheduleForm);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  const fetchData = async () => {
    try {
      const [employeeResponse, scheduleResponse] = await Promise.all([
        api.get(`/admin/employee/${id}/`),
        api.get(`/admin/employee/${id}/schedule/`),
      ]);

      setEmployee(employeeResponse.data);
      setSchedule(scheduleResponse.data || []);
    } catch (error) {
      console.error("Помилка при завантаженні співробітника", error);
      toast.error("Не вдалося завантажити співробітника");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusChange = async () => {
    if (!modal || !employee) return;

    try {
      setIsUpdating(true);

      if (modal.action === "deactivate") {
        await api.patch(`/admin/employee/${employee.id}/deactivate/`, {
          date_of_dismissal: null,
        });

        setEmployee((prev) => ({
          ...prev,
          is_active: false,
          date_of_dismissal: new Date().toISOString().split("T")[0],
        }));

        toast.success("Співробітника звільнено");
      } else {
        await api.patch(`/admin/employee/${employee.id}/activate/`);

        setEmployee((prev) => ({
          ...prev,
          is_active: true,
          date_of_dismissal: null,
        }));

        toast.success("Співробітника активовано");
      }

      setModal(null);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        "Помилка при зміні статусу співробітника";

      console.error("Помилка при зміні статусу співробітника", error);
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const openCreateScheduleModal = () => {
    setScheduleForm(emptyScheduleForm);
    setScheduleModal({ mode: "create" });
  };

  const openEditScheduleModal = (item) => {
    setScheduleForm({
      day_of_week: item.day_of_week || "",
      start_time: item.start_time?.slice(0, 5) || "",
      end_time: item.end_time?.slice(0, 5) || "",
    });

    setScheduleModal({
      mode: "edit",
      item,
    });
  };

  const handleScheduleChange = (e) => {
    setScheduleForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveSchedule = async () => {
    if (
      !scheduleForm.day_of_week ||
      !scheduleForm.start_time ||
      !scheduleForm.end_time
    ) {
      toast("Заповніть усі поля розкладу");
      return;
    }

    try {
      setIsSavingSchedule(true);

      if (scheduleModal?.mode === "create") {
        const response = await api.post(
          `/admin/employee/${employee.id}/schedule/create/`,
          scheduleForm,
        );

        setSchedule((prev) => [...prev, response.data.schedule]);
        toast.success(response.data.message || "Розклад додано");
      }

      if (scheduleModal?.mode === "edit") {
        const response = await api.patch(
          `/admin/employee/${employee.id}/schedule/${scheduleModal.item.id}/update/`,
          scheduleForm,
        );

        setSchedule((prev) =>
          prev.map((item) =>
            item.id === scheduleModal.item.id ? response.data.schedule : item,
          ),
        );

        toast.success(response.data.message || "Розклад оновлено");
      }

      setScheduleModal(null);
      setScheduleForm(emptyScheduleForm);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.end_time ||
        error.response?.data?.non_field_errors ||
        "Помилка при збереженні розкладу";

      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await api.delete(
        `/admin/employee/${employee.id}/schedule/${scheduleId}/delete/`,
      );

      setSchedule((prev) => prev.filter((item) => item.id !== scheduleId));
      toast.success("Розклад видалено");
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при видаленні розкладу";

      toast.error(message);
    }
  };

  if (loading || !employee) {
    return <Loader text="Завантаження співробітника..." />;
  }

  const isFemale = employee.sex === "Жінка";

  return (
    <main className="admin-employee-detail-page">
      <div className="admin-employee-detail-topbar">
        <Button
          variant="outline"
          onClick={() => navigate("/administrator/employees/")}
        >
          Назад
        </Button>
      </div>

      <Card className="admin-employee-detail-hero">
        <div>
          <p className="employee-detail-label">Співробітник</p>

          <h1>
            {employee.last_name} {employee.first_name} {employee.middle_name}
          </h1>

          <p className="employee-detail-subtitle">
            Логін: {employee.login} • ID: {employee.id}
          </p>
        </div>

        <div className="employee-detail-badges">
          <span
            className={
              isFemale ? "employee-sex-badge female" : "employee-sex-badge male"
            }
          >
            {employee.sex}
          </span>

          <span
            className={
              employee.is_active
                ? "employee-status-badge active"
                : "employee-status-badge inactive"
            }
          >
            {employee.is_active ? "Активний" : "Заблокований"}
          </span>
        </div>
      </Card>

      <div className="admin-employee-detail-grid">
        <Card className="admin-employee-detail-card">
          <h3>Особисті дані</h3>

          <div className="employee-info-list">
            <div>
              <span>Дата народження</span>
              <strong>
                {new Date(employee.date_of_birth).toLocaleDateString("uk-UA")}
              </strong>
            </div>

            <div>
              <span>Сімейний стан</span>
              <strong>{employee.marital_status || "Не вказано"}</strong>
            </div>

            <div>
              <span>Освіта</span>
              <strong>{employee.education || "Не вказано"}</strong>
            </div>
          </div>
        </Card>

        <Card className="admin-employee-detail-card">
          <h3>Контакти</h3>

          <div className="employee-info-list">
            <div>
              <span>Телефон</span>
              <strong>{employee.phone_number || "Не вказано"}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{employee.email || "Не вказано"}</strong>
            </div>

            <div>
              <span>Адреса</span>
              <strong>{employee.address || "Не вказано"}</strong>
            </div>
          </div>
        </Card>

        <Card className="admin-employee-detail-card">
          <h3>Робота</h3>

          <div className="employee-info-list">
            <div>
              <span>Посада</span>
              <strong>{employee.position || "Не вказано"}</strong>
            </div>

            <div>
              <span>Дата найму</span>
              <strong>
                {new Date(employee.date_of_hire).toLocaleDateString("uk-UA")}
              </strong>
            </div>

            <div>
              <span>Дата звільнення</span>
              <strong>
                {employee.date_of_dismissal
                  ? new Date(employee.date_of_dismissal).toLocaleDateString(
                      "uk-UA",
                    )
                  : "Не звільнений"}
              </strong>
            </div>
          </div>
        </Card>
      </div>

      <section className="employee-schedule-section">
        <div className="section-heading employee-schedule-heading">
          <div>
            <h2>Розклад роботи</h2>
            <p>Робочі дні та години співробітника.</p>
          </div>

          <Button variant="info" onClick={openCreateScheduleModal}>
            Додати день
          </Button>
        </div>

        {schedule.length === 0 ? (
          <Card>
            <p className="empty-text">Розклад ще не створено.</p>
          </Card>
        ) : (
          <div className="employee-schedule-grid">
            {schedule.map((item) => (
              <Card key={item.id} className="employee-schedule-card">
                <div>
                  <span>{item.day_of_week}</span>

                  <strong>
                    {item.start_time.slice(0, 5)} — {item.end_time.slice(0, 5)}
                  </strong>
                </div>

                <div className="employee-schedule-actions">
                  <Button
                    variant="outline"
                    onClick={() => openEditScheduleModal(item)}
                  >
                    Редагувати
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => handleDeleteSchedule(item.id)}
                  >
                    Видалити
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <div className="admin-employee-detail-actions">
        <Button
          variant="info"
          onClick={() =>
            navigate(`/administrator/employees/${employee.id}/update/`)
          }
        >
          Редагувати співробітника
        </Button>

        {!employee.is_current_user && (
          <>
            {employee.is_active ? (
              <Button
                variant="danger"
                onClick={() => setModal({ action: "deactivate" })}
              >
                Звільнити
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setModal({ action: "activate" })}
              >
                Активувати
              </Button>
            )}
          </>
        )}
      </div>

      <Modal isOpen={!!modal} onClose={() => setModal(null)}>
        <div className="employee-status-modal">
          <h2>
            {modal?.action === "deactivate"
              ? "Звільнити співробітника?"
              : "Активувати співробітника?"}
          </h2>

          <p>
            {modal?.action === "deactivate"
              ? "Після звільнення доступ співробітника до системи буде заблоковано."
              : "Після активації співробітник знову отримає доступ до системи."}
          </p>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setModal(null)}
              disabled={isUpdating}
            >
              Скасувати
            </Button>

            <Button
              variant={modal?.action === "deactivate" ? "danger" : "primary"}
              onClick={handleStatusChange}
              disabled={isUpdating}
            >
              {isUpdating
                ? "Збереження..."
                : modal?.action === "deactivate"
                  ? "Звільнити"
                  : "Активувати"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!scheduleModal} onClose={() => setScheduleModal(null)}>
        <div className="schedule-modal">
          <h2>
            {scheduleModal?.mode === "create"
              ? "Додати день розкладу"
              : "Редагувати розклад"}
          </h2>

          <div className="schedule-form">
            <div className="form-group">
              <label>День тижня</label>

              <select
                name="day_of_week"
                value={scheduleForm.day_of_week}
                onChange={handleScheduleChange}
              >
                <option value="">Оберіть день</option>
                <option value="Понеділок">Понеділок</option>
                <option value="Вівторок">Вівторок</option>
                <option value="Середа">Середа</option>
                <option value="Четвер">Четвер</option>
                <option value="П'ятниця">П'ятниця</option>
                <option value="Субота">Субота</option>
                <option value="Неділя">Неділя</option>
              </select>
            </div>

            <div className="form-group">
              <label>Початок</label>

              <input
                type="time"
                name="start_time"
                value={scheduleForm.start_time}
                onChange={handleScheduleChange}
              />
            </div>

            <div className="form-group">
              <label>Кінець</label>

              <input
                type="time"
                name="end_time"
                value={scheduleForm.end_time}
                onChange={handleScheduleChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setScheduleModal(null)}
              disabled={isSavingSchedule}
            >
              Скасувати
            </Button>

            <Button
              variant="info"
              onClick={handleSaveSchedule}
              disabled={isSavingSchedule}
            >
              {isSavingSchedule ? "Збереження..." : "Зберегти"}
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default AdminEmployeeDetail;

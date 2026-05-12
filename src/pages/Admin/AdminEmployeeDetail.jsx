import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import Modal from "../../components/UI/Modal";

import "./AdminEmployeeDetail.css";

const AdminEmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
        error.response?.data?.error || "Помилка при зміні статусу співробітника";

      console.error("Помилка при зміні статусу співробітника", error);
      toast.error(message);
    } finally {
      setIsUpdating(false);
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

        <Card className="admin-employee-status-card">
          <span>Статус акаунта</span>

          <strong>{employee.is_active ? "Активний" : "Заблокований"}</strong>

          <p>
            {employee.is_active
              ? "Співробітник має доступ до системи."
              : "Доступ співробітника до системи заблоковано."}
          </p>
        </Card>
      </div>

      <section className="employee-schedule-section">
        <div className="section-heading">
          <h2>Розклад роботи</h2>
          <p>Робочі дні та години співробітника.</p>
        </div>

        {schedule.length === 0 ? (
          <Card>
            <p className="empty-text">Розклад ще не створено.</p>
          </Card>
        ) : (
          <div className="employee-schedule-grid">
            {schedule.map((item) => (
              <Card key={item.id} className="employee-schedule-card">
                <span>{item.day_of_week}</span>

                <strong>
                  {item.start_time.slice(0, 5)} — {item.end_time.slice(0, 5)}
                </strong>
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
          Редагувати
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
    </main>
  );
};

export default AdminEmployeeDetail;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const AdminEmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [modal, setModal] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`/admin/employee/${id}/`);
      setEmployee(response.data);
    } catch (error) {
      console.error("Помилка при завантаженні співробітника", error);
    }
  };
  const fetchSchedule = async () => {
    try {
      const response = await api.get(`/admin/employee/${id}/schedule/`);
      setSchedule(response.data);
      setLoadingSchedule(false);
    } catch (error) {
      console.error("Помилка при завантаженні графіку співробітника", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
    fetchSchedule();
  }, [id]);

  const handleStatusChange = async () => {
    if (!modal || !employee) return;

    try {
      if (modal.action === "deactivate") {
        await api.patch(`/admin/employee/${employee.id}/deactivate/`);
      } else {
        await api.patch(`/admin/employee/${employee.id}/activate/`);
      }

      await fetchEmployee();
      setModal(null);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        "Помилка при зміні статусу співробітника";

      console.error("Помилка при зміні статусу співробітника", error);
      alert(message);
    }
  };

  if (!employee) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Співробітник</h2>
      {modal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              minWidth: "300px",
            }}
          >
            <h3>Підтвердження дії</h3>

            <p>
              {modal.action === "deactivate"
                ? "Ви впевнені, що хочете звільнити цього співробітника?"
                : "Ви впевнені, що хочете активувати цього співробітника?"}
            </p>

            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button onClick={handleStatusChange}>
                {modal.action === "deactivate" ? "Звільнити" : "Активувати"}
              </button>

              <button onClick={() => setModal(null)}>Скасувати</button>
            </div>
          </div>
        </div>
      )}
      <p>
        <strong>ID:</strong> {employee.id}
      </p>

      <p>
        <strong>Логін:</strong> {employee.login}
      </p>

      <p>
        <strong>ПІБ:</strong> {employee.last_name} {employee.first_name}{" "}
        {employee.middle_name}
      </p>

      <p>
        <strong>Дата народження:</strong> {employee.date_of_birth}
      </p>

      <p>
        <strong>Стать:</strong> {employee.sex}
      </p>

      <p>
        <strong>Номер телефону:</strong> {employee.phone_number}
      </p>

      <p>
        <strong>Електронна пошта:</strong> {employee.email}
      </p>

      <p>
        <strong>Адреса:</strong> {employee.address}
      </p>

      <p>
        <strong>Сімейний стан:</strong> {employee.marital_status}
      </p>

      <p>
        <strong>Освіта:</strong> {employee.education}
      </p>

      <p>
        <strong>Посада:</strong> {employee.position}
      </p>

      <p>
        <strong>Дата найму:</strong> {employee.date_of_hire}
      </p>

      <p>
        <strong>Дата звільнення:</strong>{" "}
        {employee.date_of_dismissal || "Не звільнений"}
      </p>

      <p>
        <strong>Статус акаунта:</strong>{" "}
        {employee.is_active ? "Активний" : "Заблокований"}
      </p>

      <h3>Розклад роботи</h3>

      {loadingSchedule ? (
        <p>Завантаження...</p>
      ) : schedule.length === 0 ? (
        <p>Розклад ще не створено</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>День</th>
              <th>Початок</th>
              <th>Кінець</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item) => (
              <tr key={item.id}>
                <td>{item.day_of_week}</td>
                <td>{item.start_time.slice(0, 5)}</td>
                <td>{item.end_time.slice(0, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() =>
          navigate(`/administrator/employees/${employee.id}/update/`)
        }
      >
        Редагувати
      </button>
      {!employee.is_current_user && (
        <>
          {employee.is_active ? (
            <button onClick={() => setModal({ action: "deactivate" })}>
              Звільнити
            </button>
          ) : (
            <button onClick={() => setModal({ action: "activate" })}>
              Активувати
            </button>
          )}
        </>
      )}
      <button onClick={() => navigate("/administrator/employees/")}>
        Назад
      </button>
    </div>
  );
};

export default AdminEmployeeDetail;

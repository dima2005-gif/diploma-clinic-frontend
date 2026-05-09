import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const AdminEmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [positions, setPositions] = useState([]);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeResponse = await api.get(`/admin/employee/${id}/`);
        const positionsResponse = await api.get("/admin/position/");

        setPositions(positionsResponse.data);

        const employee = employeeResponse.data;
        const currentPosition = positionsResponse.data.find(
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
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: null,
    });
  };

  const handleSubmit = async () => {
    try {
      await api.patch(`/admin/employee/${id}/update/`, {
        ...form,
        position_id: Number(form.position_id),
      });

      navigate(`/administrator/employees/`);
    } catch (error) {
      console.error("Помилка при оновленні співробітника", error);

      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert("Помилка при оновленні співробітника");
      }
    }
  };

  if (!form) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Редагувати співробітника</h2>

      <div>
        <label>Прізвище</label>
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
        />
        {errors.last_name && <p>{errors.last_name}</p>}
      </div>

      <div>
        <label>Ім'я</label>
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
        />
        {errors.first_name && <p>{errors.first_name}</p>}
      </div>

      <div>
        <label>По батькові</label>
        <input
          name="middle_name"
          value={form.middle_name}
          onChange={handleChange}
        />
        {errors.middle_name && <p>{errors.middle_name}</p>}
      </div>

      <div>
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
        {errors.position_id && <p>{errors.position_id}</p>}
      </div>

      <div>
        <label>Дата народження</label>
        <input
          type="date"
          name="date_of_birth"
          value={form.date_of_birth}
          max={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
        />
        {errors.date_of_birth && <p>{errors.date_of_birth}</p>}
      </div>

      <div>
        <label>Номер телефону</label>
        <input
          name="phone_number"
          value={form.phone_number}
          placeholder="+380501234567"
          onChange={handleChange}
        />
        {errors.phone_number && <p>{errors.phone_number}</p>}
      </div>

      <div>
        <label>Адреса</label>
        <input name="address" value={form.address} onChange={handleChange} />
        {errors.address && <p>{errors.address}</p>}
      </div>

      <div>
        <label>Електронна пошта</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p>{errors.email}</p>}
      </div>

      <div>
        <label>Стать</label>
        <select name="sex" value={form.sex} onChange={handleChange}>
          <option value="">Оберіть стать</option>
          <option value="Чоловік">Чоловік</option>
          <option value="Жінка">Жінка</option>
        </select>
        {errors.sex && <p>{errors.sex}</p>}
      </div>

      <div>
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
        {errors.marital_status && <p>{errors.marital_status}</p>}
      </div>

      <div>
        <label>Освіта</label>
        <select name="education" value={form.education} onChange={handleChange}>
          <option value="">Оберіть освіту</option>
          <option value="Вища освіта">Вища освіта</option>
          <option value="Середня професійна">Середня професійна</option>
          <option value="Базова вища освіта">Базова вища освіта</option>
          <option value="Неповна вища освіта">Неповна вища освіта</option>
        </select>
        {errors.education && <p>{errors.education}</p>}
      </div>

      <div>
        <label>Дата найму</label>
        <input
          type="date"
          name="date_of_hire"
          value={form.date_of_hire}
          max={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
        />
        {errors.date_of_hire && <p>{errors.date_of_hire}</p>}
      </div>

      <button onClick={handleSubmit}>Зберегти</button>
      <button onClick={() => navigate(`/administrator/employees/`)}>
        Скасувати
      </button>
    </div>
  );
};

export default AdminEmployeeEdit;

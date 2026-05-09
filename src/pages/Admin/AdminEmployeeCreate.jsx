import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AdminEmployeeCreate = () => {
  const navigate = useNavigate();

  const [positions, setPositions] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    position_id: "",
    date_of_birth: "",
    phone_number: "",
    address: "",
    email: "",
    sex: "",
    marital_status: "",
    education: "",
    date_of_hire: "",
  });

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await api.get("/admin/position/");
        setPositions(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні посад", error);
      }
    };

    fetchPositions();
  }, []);

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
      const response = await api.post("/admin/employee/create/", {
        ...form,
        position_id: Number(form.position_id),
      });

      alert(response.data.message);
      navigate(`/admin/employees/`);
    } catch (error) {
      console.error("Помилка при створенні співробітника", error);

      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert("Помилка при створенні співробітника");
      }
    }
  };

  return (
    <div>
      <h2>Додати співробітника</h2>

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
          <option value="Одружена">Одружений</option>
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

      <button onClick={handleSubmit}>Створити</button>
      <button onClick={() => navigate("/administrator/employees/")}>
        Скасувати
      </button>
    </div>
  );
};

export default AdminEmployeeCreate;

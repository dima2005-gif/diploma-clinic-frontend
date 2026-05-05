import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("/register/create/", {
        ...form,
        weight: Number(form.weight),
        height: Number(form.height),
      });

      alert(response.data.message);
      navigate(`/register/`);
    } catch (error) {
      console.error("Помилка при створенні пацієнта", error);

      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert("Помилка при створенні пацієнта");
      }
    }
  };

  return (
    <div>
      <h2>Додати пацієнта</h2>

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
          placeholder="+380501112233"
          onChange={handleChange}
        />
        {errors.phone_number && <p>{errors.phone_number}</p>}
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
        <label>Адреса</label>
        <input name="address" value={form.address} onChange={handleChange} />
        {errors.address && <p>{errors.address}</p>}
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
        <label>Вага</label>
        <input
          type="number"
          name="weight"
          value={form.weight}
          onChange={handleChange}
        />
        {errors.weight && <p>{errors.weight}</p>}
      </div>

      <div>
        <label>Зріст</label>
        <input
          type="number"
          name="height"
          value={form.height}
          onChange={handleChange}
        />
        {errors.height && <p>{errors.height}</p>}
      </div>

      <div>
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
        {errors.blood_group && <p>{errors.blood_group}</p>}
      </div>

      <button onClick={handleSubmit}>Створити</button>
      <button onClick={() => navigate("/register/patients/")}>Скасувати</button>
    </div>
  );
};

export default RegisterPatientCreate;

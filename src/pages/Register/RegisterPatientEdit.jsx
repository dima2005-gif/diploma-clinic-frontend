import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const RegisterPatientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/register/${id}/`);
        setForm({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          middle_name: response.data.middle_name || "",
          date_of_birth: response.data.date_of_birth || "",
          phone_number: response.data.phone_number || "",
          email: response.data.email || "",
          address: response.data.address || "",
          sex: response.data.sex || "",
          weight: response.data.weight || "",
          height: response.data.height || "",
          blood_group: response.data.blood_group || "",
        });
      } catch (error) {
        console.error("Помилка при завантаженні пацієнта", error);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await api.patch(`/register/${id}/update/`, {
        ...form,
        weight: Number(form.weight),
        height: Number(form.height),
      });

      navigate(`/register/`);
    } catch (error) {
      console.error("Помилка при оновленні пацієнта", error);

      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert("Помилка при оновленні пацієнта");
      }
    }
  };

  if (!form) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Редагувати пацієнта</h2>

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
        />{" "}
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
        />{" "}
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

      <button onClick={handleSubmit}>Зберегти</button>
      <button onClick={() => navigate(`/register/${id}/`)}>Скасувати</button>
    </div>
  );
};

export default RegisterPatientEdit;

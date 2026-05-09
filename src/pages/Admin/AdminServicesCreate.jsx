import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AdminServiceCreate = () => {
  const navigate = useNavigate();

  const [positions, setPositions] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    position_ids: [],
  });

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await api.get("/admin/doctor-position/");
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

  const handlePositionChange = (positionId) => {
    setForm((prev) => {
      const exists = prev.position_ids.includes(positionId);

      return {
        ...prev,
        position_ids: exists
          ? prev.position_ids.filter((id) => id !== positionId)
          : [...prev.position_ids, positionId],
      };
    });

    setErrors({
      ...errors,
      position_ids: null,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("/admin/service/create/", {
        ...form,
        price: Number(form.price),
      });

      alert(response.data.message);
      navigate(`/administrator/service/`);
    } catch (error) {
      console.error("Помилка при створенні послуги", error);

      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert("Помилка при створенні послуги");
      }
    }
  };

  return (
    <div>
      <h2>Додати послугу</h2>

      <div>
        <label>Назва</label>
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <p>{errors.name}</p>}
      </div>

      <div>
        <label>Опис</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        {errors.description && <p>{errors.description}</p>}
      </div>

      <div>
        <label>Вартість</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
        />
        {errors.price && <p>{errors.price}</p>}
      </div>

      <div>
        <h3>Посади, які надають послугу</h3>

        {positions.map((position) => (
          <label key={position.id}>
            <input
              type="checkbox"
              checked={form.position_ids.includes(position.id)}
              onChange={() => handlePositionChange(position.id)}
            />
            {position.name}
          </label>
        ))}

        {errors.position_ids && <p>{errors.position_ids}</p>}
      </div>

      <button onClick={handleSubmit}>Створити</button>
      <button onClick={() => navigate("/administrator/services/")}>
        Скасувати
      </button>
    </div>
  );
};

export default AdminServiceCreate;

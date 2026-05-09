import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const AdminServiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [positions, setPositions] = useState([]);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceResponse = await api.get(`/admin/service/${id}/`);
        const positionsResponse = await api.get("/admin/doctor-position/");

        const service = serviceResponse.data;

        setPositions(positionsResponse.data);

        setForm({
          name: service.name || "",
          description: service.description || "",
          price: service.price || "",
          position_ids: service.positions
            ? service.positions.map((position) => position.id)
            : [],
        });
      } catch (error) {
        console.error("Помилка при завантаженні послуги", error);
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
      await api.patch(`/admin/service/${id}/update/`, {
        ...form,
        price: Number(form.price),
      });

      navigate(`/administrator/services/`);
    } catch (error) {
      console.error("Помилка при оновленні послуги", error);

      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert("Помилка при оновленні послуги");
      }
    }
  };

  if (!form) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Редагувати послугу</h2>

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

      <button onClick={handleSubmit}>Зберегти</button>
      <button onClick={() => navigate(`/administrator/services/`)}>
        Скасувати
      </button>
    </div>
  );
};

export default AdminServiceEdit;

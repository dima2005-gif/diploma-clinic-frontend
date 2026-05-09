import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const AdminAnalysisEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/admin/analysis/${id}/`);

        setForm({
          name: response.data.name || "",
          description: response.data.description || "",
          price: response.data.price || "",
        });
      } catch (error) {
        console.error("Помилка при завантаженні аналізу", error);
      }
    };

    fetchAnalysis();
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
      await api.patch(`/admin/analysis/${id}/update/`, {
        ...form,
        price: Number(form.price),
      });

      navigate(`/administrator/analyses/${id}/`);
    } catch (error) {
      console.error("Помилка при оновленні аналізу", error);

      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert("Помилка при оновленні аналізу");
      }
    }
  };

  if (!form) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Редагувати аналіз</h2>

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

      <button onClick={handleSubmit}>Зберегти</button>
      <button onClick={() => navigate(`/administrator/analyses/${id}/`)}>
        Скасувати
      </button>
    </div>
  );
};

export default AdminAnalysisEdit;

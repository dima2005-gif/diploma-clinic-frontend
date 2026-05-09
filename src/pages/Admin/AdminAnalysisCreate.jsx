import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AdminAnalysisCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [errors, setErrors] = useState({});

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
      const response = await api.post("/admin/analysis/create/", {
        ...form,
        price: Number(form.price),
      });

      alert(response.data.message);
      navigate(`/administrator/analyses/`);
    } catch (error) {
      console.error("Помилка при створенні аналізу", error);

      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert("Помилка при створенні аналізу");
      }
    }
  };

  return (
    <div>
      <h2>Додати аналіз</h2>

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

      <button onClick={handleSubmit}>Створити</button>
      <button onClick={() => navigate("/administrator/analyses/")}>
        Скасувати
      </button>
    </div>
  );
};

export default AdminAnalysisCreate;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const PatientResponses = () => {
  const navigate = useNavigate();

  const [availableVisits, setAvailableVisits] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createForm, setCreateForm] = useState({
    prescribed_service_id: "",
    rating: 5,
    comment: "",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: "",
  });

  const fetchData = async () => {
    try {
      const availableResponse = await api.get("/patient/response/available/");
      const responsesResponse = await api.get("/patient/responses/");

      setAvailableVisits(availableResponse.data);
      setResponses(responsesResponse.data);
    } catch (error) {
      console.error("Помилка при завантаженні відгуків", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateChange = (e) => {
    setCreateForm({
      ...createForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateSubmit = async () => {
    if (!createForm.prescribed_service_id) {
      alert("Оберіть прийом");
      return;
    }

    try {
      await api.post("/patient/response/create/", {
        prescribed_service_id: Number(createForm.prescribed_service_id),
        rating: Number(createForm.rating),
        comment: createForm.comment,
      });

      setCreateForm({
        prescribed_service_id: "",
        rating: 5,
        comment: "",
      });

      await fetchData();
      alert("Відгук успішно залишено");
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при створенні відгуку";
      alert(message);
    }
  };

  const startEdit = (response) => {
    setEditId(response.id);
    setEditForm({
      rating: response.rating,
      comment: response.comment,
    });
  };

  const handleUpdateSubmit = async () => {
    try {
      await api.patch(`/patient/response/${editId}/update/`, {
        rating: Number(editForm.rating),
        comment: editForm.comment,
      });

      setEditId(null);
      await fetchData();
      alert("Відгук оновлено");
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при оновленні відгуку";
      alert(message);
    }
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Відгуки</h2>

      <h3>Доступні прийоми для відгуку</h3>

      {availableVisits.filter((visit) => !visit.has_response).length === 0 ? (
        <p>Немає прийомів, для яких можна залишити відгук.</p>
      ) : (
        <div>
          <select
            name="prescribed_service_id"
            value={createForm.prescribed_service_id}
            onChange={handleCreateChange}
          >
            <option value="">Оберіть прийом</option>

            {availableVisits
              .filter((visit) => !visit.has_response)
              .map((visit) => (
                <option key={visit.id} value={visit.id}>
                  {visit.service} — {visit.doctor} —{" "}
                  {new Date(visit.date_prescribed).toLocaleString("uk-UA")}
                </option>
              ))}
          </select>

          <div>
            <label>Оцінка</label>
            <select
              name="rating"
              value={createForm.rating}
              onChange={handleCreateChange}
            >
              <option value="5">5 — Відмінно</option>
              <option value="4">4 — Добре</option>
              <option value="3">3 — Нормально</option>
              <option value="2">2 — Погано</option>
              <option value="1">1 — Дуже погано</option>
            </select>
          </div>

          <div>
            <label>Коментар</label>
            <textarea
              name="comment"
              value={createForm.comment}
              onChange={handleCreateChange}
            />
          </div>

          <button onClick={handleCreateSubmit}>Залишити відгук</button>
        </div>
      )}

      <h3>Мої відгуки</h3>

      {responses.length === 0 ? (
        <p>Ви ще не залишали відгуків.</p>
      ) : (
        responses.map((response) => (
          <div key={response.id}>
            <p>
              <strong>Послуга:</strong> {response.service}
            </p>

            <p>
              <strong>Лікар:</strong> {response.doctor}
            </p>

            <p>
              <strong>Дата прийому:</strong>{" "}
              {new Date(response.date_prescribed).toLocaleString("uk-UA")}
            </p>

            {editId === response.id ? (
              <div>
                <div>
                  <label>Оцінка</label>
                  <select
                    name="rating"
                    value={editForm.rating}
                    onChange={handleEditChange}
                  >
                    <option value="5">5 — Відмінно</option>
                    <option value="4">4 — Добре</option>
                    <option value="3">3 — Нормально</option>
                    <option value="2">2 — Погано</option>
                    <option value="1">1 — Дуже погано</option>
                  </select>
                </div>

                <div>
                  <label>Коментар</label>
                  <textarea
                    name="comment"
                    value={editForm.comment}
                    onChange={handleEditChange}
                  />
                </div>

                <button onClick={handleUpdateSubmit}>Зберегти</button>
                <button onClick={() => setEditId(null)}>Скасувати</button>
              </div>
            ) : (
              <div>
                <p>
                  <strong>Оцінка:</strong> {response.rating}/5
                </p>

                <p>
                  <strong>Коментар:</strong> {response.comment}
                </p>

                <p>
                  <strong>Дата відгуку:</strong>{" "}
                  {new Date(response.date_created).toLocaleString("uk-UA")}
                </p>

                <button onClick={() => startEdit(response)}>Редагувати</button>
              </div>
            )}

            <hr />
          </div>
        ))
      )}

      <button onClick={() => navigate("/patient/")}>Назад</button>
    </div>
  );
};

export default PatientResponses;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";
import PatientLayout from "../../components/layouts/PatientLayout";
import RatingStars from "../../components/UI/RatingStars";

import "./Responses.css";

const PatientResponses = () => {
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState(null);
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
      const patientResponse = await api.get("/patient/");
      const availableResponse = await api.get("/patient/response/available/");
      const responsesResponse = await api.get("/patient/responses/");

      setPatientData(patientResponse.data);
      setAvailableVisits(availableResponse.data || []);
      setResponses(responsesResponse.data || []);
    } catch (error) {
      console.error("Помилка при завантаженні відгуків", error);
      toast.error("Не вдалося завантажити відгуки");
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
      toast("Оберіть прийом");
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

      toast.success("Відгук успішно залишено");
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при створенні відгуку";

      toast.error(message);
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

      toast.success("Відгук оновлено");
    } catch (error) {
      const message =
        error.response?.data?.error || "Помилка при оновленні відгуку";

      toast.error(message);
    }
  };

  if (loading || !patientData) {
    return <Loader text="Завантаження відгуків..." />;
  }

  const visitsWithoutResponse = availableVisits.filter(
    (visit) => !visit.has_response,
  );

  return (
    <PatientLayout patientData={patientData}>
      <div className="responses-topbar">
        <Button variant="outline" onClick={() => navigate("/patient/")}>
          Назад
        </Button>
      </div>

      <section className="responses-hero">
        <h1>Відгуки</h1>
        <p>
          Залишайте відгуки про отримані медичні послуги та переглядайте власні
          оцінки.
        </p>
      </section>

      <section className="responses-section">
        <div className="section-heading">
          <h2>Залишити відгук</h2>
          <p>Оберіть прийом, оцініть послугу та додайте коментар.</p>
        </div>

        {visitsWithoutResponse.length === 0 ? (
          <Card>
            <p className="empty-text">
              Немає прийомів, для яких можна залишити відгук.
            </p>
          </Card>
        ) : (
          <Card className="response-form-card">
            <div className="response-form-group">
              <label>Прийом</label>

              <select
                name="prescribed_service_id"
                value={createForm.prescribed_service_id}
                onChange={handleCreateChange}
              >
                <option value="">Оберіть прийом</option>

                {visitsWithoutResponse.map((visit) => (
                  <option key={visit.id} value={visit.id}>
                    {visit.service} — {visit.doctor} —{" "}
                    {new Date(visit.date_prescribed).toLocaleString("uk-UA")}
                  </option>
                ))}
              </select>
            </div>

            <div className="response-form-group">
              <label>Оцінка</label>

              <div className="rating-choice">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={
                      Number(createForm.rating) === rating
                        ? "rating-choice-button active"
                        : "rating-choice-button"
                    }
                    onClick={() =>
                      setCreateForm({ ...createForm, rating: rating })
                    }
                  >
                    ★ {rating}
                  </button>
                ))}
              </div>
            </div>

            <div className="response-form-group">
              <label>Коментар</label>

              <textarea
                name="comment"
                value={createForm.comment}
                onChange={handleCreateChange}
                placeholder="Опишіть свої враження від прийому..."
              />
            </div>

            <div className="response-submit-row">
              <Button variant="info" onClick={handleCreateSubmit}>
                Залишити відгук
              </Button>
            </div>
          </Card>
        )}
      </section>

      <section className="responses-section">
        <div className="section-heading">
          <h2>Мої відгуки</h2>
          <p>Відгуки, які ви вже залишили після прийомів.</p>
        </div>

        {responses.length === 0 ? (
          <Card>
            <p className="empty-text">Ви ще не залишали відгуків.</p>
          </Card>
        ) : (
          <div className="responses-grid">
            {responses.map((response) => (
              <Card key={response.id} className="response-card">
                <div>
                  <h3>{response.service}</h3>

                  <div className="response-meta">
                    <div>
                      <span>Лікар</span>
                      <strong>{response.doctor}</strong>
                    </div>

                    <div>
                      <span>Дата прийому</span>
                      <strong>
                        {new Date(response.date_prescribed).toLocaleString(
                          "uk-UA",
                        )}
                      </strong>
                    </div>
                  </div>

                  {editId === response.id ? (
                    <div className="response-edit-form">
                      <div className="response-form-group">
                        <label>Оцінка</label>

                        <div className="rating-choice">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              className={
                                Number(editForm.rating) === rating
                                  ? "rating-choice-button active"
                                  : "rating-choice-button"
                              }
                              onClick={() =>
                                setEditForm({ ...editForm, rating: rating })
                              }
                            >
                              ★ {rating}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="response-form-group">
                        <label>Коментар</label>

                        <textarea
                          name="comment"
                          value={editForm.comment}
                          onChange={handleEditChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="response-rating">
                        <RatingStars rating={response.rating} />
                      </div>

                      <p className="response-comment">{response.comment}</p>

                      <p className="response-date">
                        {new Date(response.date_created).toLocaleString(
                          "uk-UA",
                        )}
                      </p>
                    </>
                  )}
                </div>

                {editId === response.id ? (
                  <div className="response-actions">
                    <Button variant="info" onClick={handleUpdateSubmit}>
                      Зберегти
                    </Button>

                    <Button variant="outline" onClick={() => setEditId(null)}>
                      Скасувати
                    </Button>
                  </div>
                ) : (
                  <div className="response-actions">
                    <Button
                      variant="outline"
                      onClick={() => startEdit(response)}
                    >
                      Редагувати
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </PatientLayout>
  );
};

export default PatientResponses;

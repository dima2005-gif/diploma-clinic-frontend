import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";

const MedicalHistoryAccordion = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [histories, setHistories] = useState([]);
  const [openIndex, setOpenIndex] = useState();
  const [activeTabs, setActiveTabs] = useState({});

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/doctor/patient/${patientId}/history/`);
        setHistories(response.data.histories);
      } catch (error) {
        console.error("Помилка при завантаженні історії", error);
      }
    };
    fetchHistory();
  }, [patientId]);

  const handleTabClick = (index, tab) => {
    setActiveTabs((prev) => ({ ...prev, [index]: tab }));
  };

  if (!histories) <div>Завантаження історій...</div>;
  return (
    <div>
      <h3>Історія хвороби</h3>
      {histories.length === 0 && <p>Історія хвороби відсутня</p>}

      {histories.map((history, index) => (
        <div key={history.id}>
          <div onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            {history.service} —{" "}
            {new Date(history.date_arrival).toLocaleDateString("uk-UA")}
          </div>

          {openIndex === index && (
            <div>
              <div>
                <button onClick={() => handleTabClick(index, "diagnosis")}>
                  Діагноз
                </button>
                <button onClick={() => handleTabClick(index, "medicines")}>
                  Ліки
                </button>
                <button onClick={() => handleTabClick(index, "analysis")}>
                  Аналізи
                </button>
              </div>

              {activeTabs[index] === "diagnosis" && (
                <div>
                  <p>
                    <strong>Діагноз:</strong> {history.diagnosis?.name}
                  </p>
                  <p>
                    <strong>Висновок:</strong> {history.conclusion}
                  </p>
                  <p>
                    <strong>Лікар:</strong> {history.doctor.first_name}{" "}
                    {history.doctor.last_name} {history.doctor.middle_name}
                  </p>
                </div>
              )}

              {activeTabs[index] === "medicines" && (
                <div>
                  {history.medicines.map((m) => (
                    <div key={m.id}>
                      <p>
                        <strong>Ліки:</strong>
                        {m.medicine.name}
                      </p>
                      <p>
                        <strong>Рецепт:</strong>
                        {m.recipe}
                      </p>
                    </div>
                  ))}
                  {history.medicines.length === 0 && <p>Ліки відсутні</p>}
                </div>
              )}

              {activeTabs[index] === "analysis" && (
                <div>
                  {history.analyses.map((a) => (
                    <div key={a.id}>
                      <p>
                        <strong>Аналіз:</strong> {a.analysis.name}{" "}
                      </p>
                      <p>
                        <strong>Статус:</strong>
                        {a.status}
                      </p>
                      <p>
                        <strong>Лаборант:</strong>
                        {a.laboratory_assistant.first_name}{" "}
                        {a.laboratory_assistant.last_name}{" "}
                        {a.laboratory_assistant.middle_name}
                      </p>
                      <p>
                        <strong>Результати:</strong>{" "}
                        {a.result ? (
                          <a
                            href={`http://localhost:8000${a.result}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Переглянути результат
                          </a>
                        ) : (
                          "Очікування результату. Будь ласка, зачекайте на завершення дослідження"
                        )}
                      </p>
                    </div>
                  ))}
                  {history.analyses.length === 0 && <p>Аналізи відсутні</p>}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      <button onClick={() => navigate(-1)}>Назад</button>
    </div>
  );
};

export default MedicalHistoryAccordion;

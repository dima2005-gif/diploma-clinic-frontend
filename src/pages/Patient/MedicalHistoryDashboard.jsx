import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const MedicalHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/patient/medical-history/");
        setHistory(response.data);
      } catch (error) {
        console.error("Помилка при завантажені даних", error);
      }
    };
    fetchData();
  }, []);

  if (!history) {
    return <div>Завантаження історій хвороб...</div>;
  }
  return (
    <div className="medical-history-page">
      <h2>Історія хвороб</h2>
      <table>
        <thead>
          <tr>
            <th>Дата прибуття</th>
            <th>Дата вибуття</th>
            <th>Послуга</th>
            <th>Діагноз</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {history.map((data) => (
            <tr key={data.id}>
              <th>{new Date(data.date_arrival).toLocaleDateString("uk-UA")}</th>
              <th>
                {data.date_departure ? (
                  <p>
                    {new Date(data.date_arrival).toLocaleDateString("uk-UA")}
                  </p>
                ) : (
                  <p> </p>
                )}
              </th>
              <th>{data.service}</th>
              <th>{data.diagnosis?.name || "---"}</th>
              <th>
                <button
                  onClick={() =>
                    navigate(`/patient/medical-history/${data.id}`)
                  }
                >
                  Детально
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate("/patient")}>
        Повернутися на головну сторінку
      </button>
    </div>
  );
};

export default MedicalHistory;

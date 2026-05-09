import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../../styles/pdf-style.css";
import api from "../../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const AdminServicePopularityStatistics = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    start_date: today,
    end_date: today,
  });

  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const fetchStatistics = async () => {
    if (filters.start_date > filters.end_date) {
      alert("Дата початку не може бути пізніше дати кінця");
      return;
    }

    setLoading(true);

    try {
      const response = await api.get("/statistics/service-popularity/", {
        params: {
          start_date: filters.start_date,
          end_date: filters.end_date,
        },
      });

      setStatistics(response.data);
    } catch (error) {
      console.error("Помилка при завантаженні статистики", error);

      const message =
        error.response?.data?.error || "Помилка при завантаженні статистики";

      alert(message);
    } finally {
      setLoading(false);
    }
  };
  const chartItems = statistics?.results?.slice(0, 10) || [];
  const chartData = {
    labels: chartItems.map((item) => item.service) || [],

    datasets: [
      {
        label: "Кількість записів",

        data: chartItems.map((item) => item.total_records) || [],

        backgroundColor: "#1b5a4f",

        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,

    plugins: {
      legend: {
        display: true,
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
        },
      },
    },
  };
  const exportToPDF = async () => {
    const element = reportRef.current;

    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });

    const imageData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);

    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;
    }
    const fileName = `Статистика_попиту_послуг_за_${statistics.start_date}_${statistics.end_date}.pdf`;
    pdf.save(fileName);
  };

  return (
    <div className="doctor-visits-statistics-page">
      <h2>Популярність медичних послуг</h2>

      <div className="statistics-filters">
        <div>
          <label>Дата початку</label>

          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            max={today}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Дата кінця</label>

          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            max={today}
            onChange={handleChange}
          />
        </div>

        <button onClick={fetchStatistics}>Показати</button>
      </div>

      {loading && <p>Завантаження...</p>}

      {!loading && statistics && statistics.results.length > 0 && (
        <div ref={reportRef} className="pdf-report">
          <>
            <h2>Популярність медичних послуг</h2>
            <p>
              Період: {statistics.start_date} - {statistics.end_date}
            </p>
            <p>Статус записів: {statistics.status_filter}</p>
            <p>Загальна кількість послуг: {statistics.total_services}</p>
            <div className="statistics-chart">
              <Bar data={chartData} options={chartOptions} />
            </div>

            <table className="statistics-table">
              <thead>
                <tr>
                  <th>Послуга</th>
                  <th>Кількість записів</th>
                  <th>Частка попиту</th>
                </tr>
              </thead>

              <tbody>
                {statistics.results.map((item) => (
                  <tr key={item.service_id}>
                    <td>{item.service}</td>

                    <td>{item.total_records}</td>

                    <td>{item.popularity_percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        </div>
      )}

      {!loading && statistics && statistics.results.length === 0 && (
        <p>Даних за вибраний період не знайдено.</p>
      )}
      <button onClick={exportToPDF}>Експортувати в PDF</button>
      <button onClick={() => navigate("/administrator/statistics/")}>
        Назад
      </button>
    </div>
  );
};

export default AdminServicePopularityStatistics;

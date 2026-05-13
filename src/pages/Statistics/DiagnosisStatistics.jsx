import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "../../styles/pdf-style.css";
import "./DiagnosisStatistics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const AdminDiagnosisStatistics = () => {
  const navigate = useNavigate();
  const reportRef = useRef();

  const today = new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    start_date: today,
    end_date: today,
  });

  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchStatistics = async () => {
    if (filters.start_date > filters.end_date) {
      toast.error("Дата початку не може бути пізніше дати кінця");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/statistics/diagnosis/", {
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

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const chartItems = statistics?.results?.slice(0, 10) || [];

  const chartData = {
    labels: chartItems.map((item) => item.diagnosis),

    datasets: [
      {
        label: "Кількість випадків",
        data: chartItems.map((item) => item.total_records),
        backgroundColor: "#f76767",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

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

    if (!element || !statistics) return;

    try {
      setIsExporting(true);

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

      const fileName = `Статистика_захворюваності_за_${statistics.start_date}_${statistics.end_date}.pdf`;

      pdf.save(fileName);
      toast.success("PDF успішно сформовано");
    } catch (error) {
      console.error("Помилка при експорті PDF", error);
      toast.error("Не вдалося експортувати PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const hasData = statistics && statistics.results.length > 0;

  return (
    <main className="diagnosis-statistics-page">
      <div className="diagnosis-statistics-topbar">
        <Button
          variant="outline"
          onClick={() => navigate("/administrator/statistics/")}
        >
          Назад
        </Button>
      </div>

      <Card className="diagnosis-statistics-hero">
        <p className="statistics-label">Аналітика</p>

        <h1>Статистика захворюваності</h1>

        <p>
          Перегляд найбільш поширених діагнозів та кількості випадків за
          вибраний період.
        </p>
      </Card>

      <Card className="statistics-filters-card">
        <div className="section-heading">
          <h2>Фільтри</h2>
          <p>Оберіть період для формування статистичного звіту.</p>
        </div>

        <div className="statistics-filters-grid">
          <div className="form-group">
            <label>Дата початку</label>

            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              max={today}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Дата кінця</label>

            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              max={today}
              onChange={handleChange}
            />
          </div>

          <div className="statistics-filter-action">
            <Button variant="info" onClick={fetchStatistics} disabled={loading}>
              {loading ? "Завантаження..." : "Показати"}
            </Button>
          </div>
        </div>
      </Card>

      {loading && <Loader text="Завантаження статистики..." />}

      {!loading && statistics && statistics.results.length === 0 && (
        <Card>
          <p className="empty-text">Даних за вибраний період не знайдено.</p>
        </Card>
      )}

      {!loading && hasData && (
        <>
          <div className="statistics-report-actions">
            <Button variant="info" onClick={exportToPDF} disabled={isExporting}>
              {isExporting ? "Експорт..." : "Експортувати в PDF"}
            </Button>
          </div>

          <div ref={reportRef} className="pdf-report statistics-report">
            <Card className="statistics-summary-card">
              <div>
                <p className="statistics-label">Звіт</p>

                <h2>Статистика захворюваності</h2>

                <p className="statistics-period">
                  Період: {statistics.start_date} — {statistics.end_date}
                </p>
              </div>

              <div className="statistics-summary-grid red">
                <div>
                  <span>Усього випадків</span>
                  <strong>{statistics.total_diagnoses}</strong>
                </div>
              </div>
            </Card>

            <Card className="statistics-chart-card">
              <div className="section-heading">
                <h2>Графік захворюваності</h2>
                <p>Топ діагнозів за кількістю випадків.</p>
              </div>

              <div className="statistics-chart">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </Card>

            <Card className="statistics-table-card">
              <div className="section-heading">
                <h2>Детальна таблиця</h2>
                <p>Повна статистика захворюваності за діагнозами.</p>
              </div>

              <div className="statistics-table-wrapper">
                <table className="statistics-table">
                  <thead>
                    <tr>
                      <th>Діагноз</th>
                      <th>Кількість випадків</th>
                      <th>Частка</th>
                    </tr>
                  </thead>

                  <tbody>
                    {statistics.results.map((item) => (
                      <tr key={item.diagnosis_id}>
                        <td>{item.diagnosis}</td>
                        <td>{item.total_records}</td>
                        <td>{item.share_percent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}
    </main>
  );
};

export default AdminDiagnosisStatistics;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./AdminAudit.css";

const AdminAudit = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [filters, setFilters] = useState({
    start_date: today,
    end_date: today,
  });

  const fetchAudit = async () => {
    if (filters.start_date > filters.end_date) {
      toast.error("Дата початку не може бути пізніше дати кінця");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/admin/audit/", {
        params: {
          start_date: filters.start_date,
          end_date: filters.end_date,
        },
      });

      setAudit(response.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Помилка при завантаженні аудиту", error);
      toast.error("Не вдалося завантажити аудит");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const getActionClass = (action) => {
    const normalized = String(action || "").toLowerCase();

    if (normalized.includes("створ")) return "create";
    if (normalized.includes("онов")) return "update";
    if (normalized.includes("видал")) return "delete";

    return "default";
  };
  const visibleAudit = audit.slice(0, 50);
  const totalPages = Math.ceil(audit.length / itemsPerPage);

  const paginatedAudit = audit.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  return (
    <main className="admin-audit-page">
      <div className="admin-audit-topbar">
        <Button variant="outline" onClick={() => navigate("/administrator/")}>
          Назад
        </Button>
      </div>

      <section className="admin-audit-hero">
        <h1>Аудит дій користувачів</h1>

        <p>Перегляд журналу дій користувачів системи за вибраний період.</p>
      </section>

      <Card className="admin-audit-filter-card">
        {!loading && audit.length > 0 && (
          <div className="admin-audit-summary">
            Показано {paginatedAudit.length} із {audit.length} записів          </div>
        )}
        <div className="admin-audit-filter-grid">
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

          <div className="admin-audit-filter-action">
            <Button variant="info" onClick={fetchAudit}>
              Показати
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <Loader text="Завантаження аудиту..." />
      ) : audit.length === 0 ? (
        <Card>
          <p className="empty-text">
            Записів аудиту за вибраний період не знайдено.
          </p>
        </Card>
      ) : (
        <div className="admin-audit-list">
          {paginatedAudit.map((item, index) => (
            <Card key={index} className="admin-audit-card">
              <div className="audit-card-header">
                <div>
                  <span>Дата</span>
                  <strong>{new Date(item.date).toLocaleString("uk-UA")}</strong>
                </div>
                <span
                  className={`audit-action-badge ${getActionClass(item.action)}`}
                >
                  {item.action}
                </span>{" "}
              </div>

              <div className="audit-card-grid">
                <div>
                  <span>Користувач</span>
                  <strong>{item.user || "Система"}</strong>
                </div>

                <div>
                  <span>Модель</span>
                  <strong>{item.model}</strong>
                </div>

                <div>
                  <span>Об'єкт</span>
                  <strong>{item.object || "—"}</strong>
                </div>
              </div>
            </Card>

          ))}
          {totalPages > 1 && (
            <div className="audit-pagination">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Назад
              </Button>

              <span>
                Сторінка {currentPage} із {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Далі
              </Button>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default AdminAudit;

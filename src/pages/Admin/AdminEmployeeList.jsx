import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Loader from "../../components/UI/Loader";

import "./AdminEmployeeList.css";

const AdminEmployeeList = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/admin/employee/");
        setEmployees(response.data || []);
      } catch (error) {
        console.error("Помилка при завантаженні співробітників", error);
        toast.error("Не вдалося завантажити співробітників");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const query = search.toLowerCase().trim();

    const fullName = `${employee.last_name} ${employee.first_name} ${employee.middle_name || ""
      }`.toLowerCase();

    return (
      fullName.includes(query) ||
      employee.position?.toLowerCase().includes(query) ||
      employee.phone_number?.includes(query) ||
      employee.email?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <Loader text="Завантаження співробітників..." />;
  }

  return (
    <main className="admin-employee-page">
      <div className="admin-employee-topbar">
        <Button variant="outline" onClick={() => navigate("/administrator/")}>
          Назад
        </Button>
      </div>

      <section className="admin-employee-hero">
        <div>
          <h1>Список співробітників</h1>
          <p>
            Переглядайте працівників поліклініки та керуйте даними персоналу
            системи.
          </p>
        </div>

        <Button
          variant="info"
          onClick={() => navigate("/administrator/employees/create/")}
        >
          Додати співробітника
        </Button>
      </section>

      <div className="admin-employee-search-row">
        <input
          className="admin-employee-search-input"
          type="text"
          placeholder="Пошук за ПІБ, посадою, телефоном або email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className="admin-employee-section">
        <div className="section-heading">
          <h2>Співробітники</h2>
          <p>
            Знайдено: {filteredEmployees.length} із {employees.length}
          </p>
        </div>

        {filteredEmployees.length === 0 ? (
          <Card>
            <p className="empty-text">Співробітників не знайдено.</p>
          </Card>
        ) : (
          <div className="admin-employee-grid">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="admin-employee-card">
                <div>
                  <div className="admin-employee-header">
                    <h3>
                      {employee.last_name} {employee.first_name}
                    </h3>

                    <span
                      className={
                        employee.sex === "Жінка"
                          ? "employee-sex-badge female"
                          : "employee-sex-badge male"
                      }
                    >
                      {employee.sex}
                    </span>
                  </div>

                  <div className="admin-employee-meta">
                    <div>
                      <span>По батькові</span>
                      <strong>{employee.middle_name || "Не вказано"}</strong>
                    </div>

                    <div>
                      <span>Посада</span>
                      <strong>{employee.position || "Не вказано"}</strong>
                    </div>

                    {employee.phone_number && (
                      <div>
                        <span>Телефон</span>
                        <strong>{employee.phone_number}</strong>
                      </div>
                    )}

                    {employee.email && (
                      <div>
                        <span>Email</span>
                        <strong>{employee.email}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="admin-employee-actions">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(`/administrator/employees/${employee.id}/`)
                    }
                  >
                    Деталі
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminEmployeeList;

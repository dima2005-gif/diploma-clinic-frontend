import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AdminEmployeeList = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/admin/employee/");
        setEmployees(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні співробітників", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Список співробітників</h2>

      <button onClick={() => navigate("/administrator/employees/create/")}>
        Додати співробітника
      </button>

      <table>
        <thead>
          <tr>
            <th>Ім'я</th>
            <th>Прізвище</th>
            <th>По батькові</th>
            <th>Стать</th>
            <th>Позиція</th>
            <th>Дії</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="7">Співробітників не знайдено.</td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.first_name}</td>
                <td>{employee.last_name}</td>
                <td>{employee.middle_name}</td>
                <td>{employee.sex}</td>
                <td>{employee.position}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/administrator/employees/${employee.id}/`)
                    }
                  >
                    Деталі
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button onClick={() => navigate("/administrator/")}>Вийти</button>
    </div>
  );
};

export default AdminEmployeeList;

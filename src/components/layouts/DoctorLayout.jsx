import Button from "../UI/Button";
import Card from "../UI/Card";

import "./DoctorLayout.css";

const DoctorLayout = ({ doctorName, position, stats, children, onLogout }) => {
  return (
    <main className="doctor-page">
      <div className="doctor-layout">
        <Card className="doctor-info-card">
          <div>
            <p className="doctor-label">{position}</p> <h1>{doctorName}</h1>
          </div>

          {stats && (
            <div className="doctor-side-stats">
              <div className="doctor-side-stat blue">
                <span>Сьогодні</span>
                <strong>{stats.today_count}</strong>
              </div>

              <div className="doctor-side-stat yellow">
                <span>Заплановано</span>
                <strong>{stats.planned_count}</strong>
              </div>

              <div className="doctor-side-stat green">
                <span>Підтверджено</span>
                <strong>{stats.confirmed_count}</strong>
              </div>
            </div>
          )}

          {onLogout && (
            <Button variant="danger" onClick={onLogout}>
              Вийти
            </Button>
          )}
        </Card>

        <div className="doctor-content">{children}</div>
      </div>
    </main>
  );
};

export default DoctorLayout;

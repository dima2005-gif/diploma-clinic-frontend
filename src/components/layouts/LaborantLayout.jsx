import Button from "../UI/Button";
import Card from "../UI/Card";

import "./LaborantLayout.css";

const LaborantLayout = ({
  laborantName,
  position = "Лаборант",
  stats,
  children,
  onLogout,
}) => {
  return (
    <main className="laborant-page">
      <div className="laborant-layout">
        <Card className="laborant-info-card">
          <div>
            <p className="laborant-label">{position}</p>
            <h1>{laborantName}</h1>
          </div>

          {stats && (
            <div className="laborant-side-stats">
              <div className="laborant-side-stat blue">
                <span>Сьогодні</span>
                <strong>{stats.today_count}</strong>
              </div>

              <div className="laborant-side-stat yellow">
                <span>Заплановано</span>
                <strong>{stats.planned_count}</strong>
              </div>

              <div className="laborant-side-stat green">
                <span>Виконано</span>
                <strong>{stats.completed_count}</strong>
              </div>
            </div>
          )}

          {onLogout && (
            <Button variant="danger" onClick={onLogout}>
              Вийти
            </Button>
          )}
        </Card>

        <div className="laborant-content">{children}</div>
      </div>
    </main>
  );
};

export default LaborantLayout;

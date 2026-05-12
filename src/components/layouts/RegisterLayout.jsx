import Button from "../UI/Button";
import Card from "../UI/Card";

import "./RegisterLayout.css";

const RegisterLayout = ({
  registerName = "Реєстратура",
  position = "Реєстратор",
  stats,
  children,
  onLogout,
}) => {
  return (
    <main className="register-page">
      <div className="register-layout">
        <Card className="register-info-card">
          <div>
            <p className="register-label">{position}</p>
            <h1>{registerName}</h1>
          </div>
          {stats && (
            <div className="register-side-stats">
              <div className="register-side-stat yellow">
                <span>Усього</span>
                <strong>{stats.total_patients}</strong>
              </div>

              <div className="register-side-stat blue">
                <span>Чоловіків</span>
                <strong>{stats.male_patients}</strong>
              </div>

              <div className="register-side-stat red">
                <span>Жінок</span>
                <strong>{stats.female_patients}</strong>
              </div>
            </div>
          )}
          {onLogout && (
            <Button variant="danger" onClick={onLogout}>
              Вийти
            </Button>
          )}
        </Card>

        <div className="register-content">{children}</div>
      </div>
    </main>
  );
};

export default RegisterLayout;

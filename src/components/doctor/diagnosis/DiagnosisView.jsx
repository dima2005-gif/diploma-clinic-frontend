import Button from "../../UI/Button";

const DiagnosisView = ({ visit, isReadOnly, onEdit, onDelete }) => {
  const history = visit.history || null;

  if (!history?.diagnosis) {
    return (
      <div className="diagnosis-empty">
        <h3>Діагноз ще не призначено</h3>

        <p>Для цього прийому ще не вказано діагноз та висновок лікаря.</p>

        {!isReadOnly && (
          <Button variant="info" onClick={onEdit}>
            Додати діагноз
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="diagnosis-view">
      <div className="diagnosis-info-grid">
        <div>
          <span>Діагноз</span>
          <strong>{history.diagnosis?.name || history.diagnosis}</strong>
        </div>

        <div className="diagnosis-conclusion">
          <span>Висновок</span>
          <p>{history.conclusion || "Висновок не вказано."}</p>
        </div>
      </div>

      {!isReadOnly && (
        <div className="diagnosis-actions">
          <Button variant="outline" onClick={onEdit}>
            Редагувати
          </Button>

          <Button variant="danger" onClick={onDelete}>
            Видалити
          </Button>
        </div>
      )}
    </div>
  );
};

export default DiagnosisView;

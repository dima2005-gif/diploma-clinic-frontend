import Button from "../../UI/Button";
import Badge from "../../UI/Badge";

const AnalysisView = ({ analyses, isReadOnly, onAdd, onEdit, onCancel }) => {
  if (analyses.length === 0) {
    return (
      <div className="analysis-empty">
        <h3>Аналізи ще не призначено</h3>

        <p>Для цього прийому ще не додано лабораторних досліджень.</p>

        {!isReadOnly && (
          <Button variant="info" onClick={onAdd}>
            Призначити аналіз
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="analysis-view">
      <div className="analysis-grid">
        {analyses.map((item) => (
          <div key={item.id} className="analysis-item-card">
            <div className="analysis-item-header">
              <h3>{item.analysis.name}</h3>
              <Badge status={item.status} />
            </div>

            <div className="analysis-item-info">
              <div>
                <span>Лаборант</span>
                <strong>
                  {item.laboratory_assistant.last_name}{" "}
                  {item.laboratory_assistant.first_name}
                </strong>
              </div>

              <div>
                <span>Дата</span>
                <strong>
                  {new Date(item.date_prescribed).toLocaleString("uk-UA")}
                </strong>
              </div>
            </div>

            <div>
              <span>Результат</span>

              {item.status === "Відмовлено" ? (
                <p>Аналіз було скасовано.</p>
              ) : item.result ? (
                <Button
                  variant="info"
                  onClick={() =>
                    window.open(`http://localhost:8000${item.result}`, "_blank")
                  }
                >
                  Переглянути результат
                </Button>
              ) : (
                <p>
                  Очікування результату. Будь ласка, зачекайте на завершення
                  дослідження.
                </p>
              )}
            </div>
            {!isReadOnly && item.status === "Заплановано" && (
              <div className="analysis-actions">
                <Button variant="outline" onClick={() => onEdit(item)}>
                  Оновити
                </Button>

                <Button variant="danger" onClick={() => onCancel(item.id)}>
                  Скасувати
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {!isReadOnly && (
        <div className="analysis-add-row">
          <Button variant="info" onClick={onAdd}>
            Призначити аналіз
          </Button>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;

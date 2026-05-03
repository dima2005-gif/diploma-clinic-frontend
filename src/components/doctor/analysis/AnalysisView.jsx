const AnalysisView = ({ analyses, isReadOnly, onAdd, onEdit, onCancel }) => {
  return (
    <div>
      {analyses.length === 0 ? (
        <p>Аналізи ще не призначено</p>
      ) : (
        analyses.map((item) => (
          <div key={item.id}>
            <p>
              <strong>Аналіз:</strong> {item.analysis.name}
            </p>

            <p>
              <strong>Лаборант:</strong> {item.laboratory_assistant.last_name}{" "}
              {item.laboratory_assistant.first_name}
            </p>

            <p>
              <strong>Дата:</strong>{" "}
              {new Date(item.date_prescribed).toLocaleString("uk-UA")}
            </p>

            <p>
              <strong>Статус:</strong> {item.status}
            </p>

            {!isReadOnly && item.status === "Заплановано" && (
              <>
                <button onClick={() => onEdit(item)}>Оновити</button>
                <button onClick={() => onCancel(item.id)}>Скасувати</button>
              </>
            )}
          </div>
        ))
      )}

      {!isReadOnly && <button onClick={onAdd}>Призначити аналіз</button>}
    </div>
  );
};

export default AnalysisView;

const DiagnosisView = ({ visit, isReadOnly, onEdit, onDelete }) => {
  const history = visit.history || null;

  if (!history?.diagnosis) {
    return (
      <div>
        <p>Діагноз ще не призначено</p>

        {!isReadOnly && <button onClick={onEdit}>Додати діагноз</button>}
      </div>
    );
  }

  return (
    <div>
      <p>
        <strong>Діагноз:</strong> {history.diagnosis}
      </p>

      <p>
        <strong>Висновок:</strong> {history.conclusion}
      </p>

      {!isReadOnly && (
        <>
          <button onClick={onEdit}>Редагувати</button>
          <button onClick={onDelete}>Видалити</button>
        </>
      )}
    </div>
  );
};

export default DiagnosisView;

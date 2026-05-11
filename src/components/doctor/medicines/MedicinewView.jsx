import Button from "../../UI/Button";

const MedicinesView = ({ medicines, isReadOnly, onAdd, onEdit, onDelete }) => {
  if (medicines.length === 0) {
    return (
      <div className="medicine-empty">
        <h3>Ліки ще не призначено</h3>

        <p>Для цього прийому ще не додано лікарських призначень.</p>

        {!isReadOnly && (
          <Button variant="info" onClick={onAdd}>
            Додати ліки
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="medicine-view">
      <div className="medicine-grid">
        {medicines.map((item) => (
          <div key={item.id} className="medicine-item-card">
            <div>
              <span>Ліки</span>
              <strong>{item.medicine.name}</strong>
            </div>

            <div>
              <span>Рецепт</span>
              <p>{item.recipe}</p>
            </div>

            {!isReadOnly && (
              <div className="medicine-actions">
                <Button variant="outline" onClick={() => onEdit(item)}>
                  Оновити
                </Button>

                <Button variant="danger" onClick={() => onDelete(item.id)}>
                  Видалити
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {!isReadOnly && (
        <div className="medicine-add-row">
          <Button variant="info" onClick={onAdd}>
            Додати ліки
          </Button>
        </div>
      )}
    </div>
  );
};

export default MedicinesView;

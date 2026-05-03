const MedicinesView = ({ medicines, isReadOnly, onAdd, onEdit, onDelete }) => {
  return (
    <div>
      {medicines.length === 0 ? (
        <p>Ліки ще не призначено</p>
      ) : (
        medicines.map((item) => (
          <div key={item.id}>
            <p>
              <strong>Ліки:</strong> {item.medicine.name}
            </p>

            <p>
              <strong>Рецепт:</strong> {item.recipe}
            </p>

            {!isReadOnly && (
              <>
                <button onClick={() => onEdit(item)}>Оновити</button>
                <button onClick={() => onDelete(item.id)}>Видалити</button>
              </>
            )}
          </div>
        ))
      )}

      {!isReadOnly && <button onClick={onAdd}>Додати ліки</button>}
    </div>
  );
};

export default MedicinesView;

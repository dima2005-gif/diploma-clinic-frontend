import "./RatingStars.css";

const RatingStars = ({ rating }) => {
  if (!rating) {
    return <span className="rating-empty">Немає оцінок</span>;
  }

  const rounded = Math.round(Number(rating));

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rounded ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;

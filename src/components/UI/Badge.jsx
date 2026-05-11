import "./Badge.css";

const Badge = ({ status }) => {
  const getBadgeClass = () => {
    switch (status) {
      case "Підтверджено":
        return "badge green";
      case "Заплановано":
        return "badge yellow";
      case "Відмовлено":
        return "badge red";
      default:
        return "badge blue";
    }
  };

  return <span className={getBadgeClass()}>{status}</span>;
};

export default Badge;

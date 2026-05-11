import "./Loader.css";

const Loader = ({ text = "Завантаження даних..." }) => {
  return (
    <div className="loader-wrapper">
      <div className="loader"></div>
      <p>{text}</p>
    </div>
  );
};

export default Loader;

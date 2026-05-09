import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const PasswordReset = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    setMessage("");
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Введіть електронну пошту");
      return;
    }

    try {
      const response = await api.post("/password-reset/", {
        email,
      });

      setMessage(response.data.message);
      setEmail("");

      setTimeout(() => navigate("/login/"), 2500);
    } catch (error) {
      const errorText =
        error.response?.data?.error || "Помилка при відновленні доступу";

      setErrorMessage(errorText);
    }
  };

  return (
    <div>
      <h2>Відновлення доступу</h2>

      <p>Введіть електронну пошту, прив'язану до вашого акаунта.</p>

      <div>
        <label>Електронна пошта</label>
        <input
          type="email"
          value={email}
          placeholder="example@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {message && <p>{message}</p>}
      {errorMessage && <p>{errorMessage}</p>}

      <button onClick={handleSubmit}>Надіслати нові дані</button>

      <button onClick={() => navigate("/login/")}>Назад до входу</button>
    </div>
  );
};

export default PasswordReset;

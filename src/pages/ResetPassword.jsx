import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import Button from "../components/UI/Button";
import Card from "../components/UI/Card";

import logo from "../assets/logo-full.svg";

import "./Auth.css";

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
    <main className="auth-page">
      <Card className="auth-card">
        <img src={logo} alt="eKarta" className="auth-logo" />

        <div className="auth-heading">
          <h1>Відновлення доступу</h1>
          <p>Введіть електронну пошту, прив’язану до вашого акаунта.</p>
        </div>

        {message && <div className="auth-message success">{message}</div>}
        {errorMessage && (
          <div className="auth-message error">{errorMessage}</div>
        )}

        <div className="auth-form">
          <div className="form-group">
            <label>Електронна пошта</label>
            <input
              type="email"
              value={email}
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-actions">
            <Button type="button" variant="primary" onClick={handleSubmit}>
              Надіслати нові дані
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/login/")}
            >
              Назад до входу
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
};

export default PasswordReset;

import React from "react";
import api from "../api/axios";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";

import logo from "../assets/logo-full.svg";

import "./Auth.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post("/login/", { username, password });
      const token = response.data.access;
      localStorage.setItem("access_token", token);
      const decode = jwtDecode(token);
      switch (decode.position) {
        case "patient":
          navigate("/patient/");
          break;
        case "doctor":
          navigate("/doctor/");
          break;
        case "lab":
          navigate("/laborant/");
          break;
        case "register":
          navigate("/register/");
          break;
        case "admin":
          navigate("/administrator/");
          break;
        default:
          navigate("/");
      }
      console.log("Успішний вхід");
      return true;
    } catch (error) {
      console.error("Логін чи пароль невірні", error.response?.data);
      setError("Логін чи пароль невірні");
      setUsername("");
      setPassword("");
      return false;
    }
  };

  return (
    <main className="auth-page">
      <Card className="auth-card">
        <img src={logo} alt="eKarta" className="auth-logo" />

        <div className="auth-heading">
          <h1>Вхід у систему</h1>
          <p>Увійдіть до свого акаунта для продовження роботи.</p>
        </div>

        {error && <div className="auth-message error">{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Логін</label>
            <input
              type="text"
              placeholder="Введіть логін"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Введіть пароль"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="auth-link"
            onClick={() => navigate("/password-reset/")}
          >
            Забули пароль?
          </button>

          <div className="auth-actions">
            <Button type="submit" variant="primary">
              Увійти
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Назад
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
};

export default Login;

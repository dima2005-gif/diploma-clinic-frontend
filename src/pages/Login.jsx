import React from "react";
import api from "../api/axios";
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
    <div className="min-h-screen flex items-center justify-center">
      <h2>Вхід у систему</h2>
      <form onSubmit={handleLogin}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          placeholder="Логін"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Увійти</button>
        <button onClick={() => navigate("/")}>Вийти</button>
      </form>
    </div>
  );
};

export default Login;

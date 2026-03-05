import React from "react";
import api from "../api/axios";

const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post('/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      console.log("Успішний вхід");
      window.location.href = "/patient/";
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
    <div className="login-container">
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
      </form>
    </div>
  );
};

export default Login;

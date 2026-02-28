import React from "react";
import api from "../api/axios";

const Login = () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login/', {username, password});
            localStorage.setItem('access_token', response.data.access);
            console.log("Успішний вхід");
            window.location.href = "/patient/";
            return true;
    } catch (error) {
        console.error("Логін чи пароль невірні", error.response?.data);
        return false;
    }
};

return (
    <div className="login-container">
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Логін"
                value = {username}
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Увійти</button>
        </form>
    </div>
);
};

export default Login;
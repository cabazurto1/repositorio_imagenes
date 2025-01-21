import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const sanitizeInput = (input) => {
    // Expresión regular que permite solo letras, números y algunos caracteres básicos
    const regex = /^[a-zA-Z0-9_@.-]*$/;
    return regex.test(input);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!sanitizeInput(username) || !sanitizeInput(password)) {
      setError("La entrada contiene caracteres no permitidos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: username, pass: password }),
      });

      if (!response.ok) throw new Error("Credenciales incorrectas.");
      const data = await response.json();
      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } catch (err) {
      setError("Credenciales incorrectas. Intenta nuevamente.");
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <h2>🔐 Inicia Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="button primary">
            Ingresar
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;

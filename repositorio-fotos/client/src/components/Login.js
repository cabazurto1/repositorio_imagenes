import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/admin/login', {
        user: username,
        pass: password,
      });
      navigate('/admin');
    } catch (err) {
      setError('Credenciales incorrectas. Intenta nuevamente.');
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h2><i className="fas fa-user-shield"></i> Inicio de Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="button button-success">Iniciar Sesión</button>
        </form>
        {error && <p className="message error">{error}</p>}
        <p><Link to="/" className="link">Volver al Menú Principal</Link></p>
      </div>
    </div>
  );
};

export default Login;

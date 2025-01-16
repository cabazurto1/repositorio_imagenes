import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const MainMenu = () => {
  return (
    <div className="container">
      <div className="box">
        <h1><i className="fas fa-images"></i> Menú Principal</h1>
        <Link to="/upload" className="button button-primary">Subir Imagen</Link>
        <Link to="/login" className="button button-secondary">Iniciar Sesión Admin</Link>
      </div>
    </div>
  );
};

export default MainMenu;

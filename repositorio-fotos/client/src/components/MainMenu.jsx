import React from "react";
import { Link } from "react-router-dom";
import "../styles/MainMenu.css";

const MainMenu = () => {
  return (
    <div className="main-menu">
      <div className="main-menu-content">
        {/* Hero Section */}
        <div className="hero-text">
          <h1>Repositorio de Fotos</h1>
          <p>Guarda, comparte y administra tus imágenes con facilidad.</p>
        </div>

        {/* Botones de acción */}
        <div className="action-buttons">
          <Link to="/upload" className="button primary">
            Subir Fotos
          </Link>
          <Link to="/login" className="button secondary">
            Administrador
          </Link>
        </div>

        {/* Imagen decorativa */}
        <div className="hero-image">
          <img
            src="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
            alt="Ilustración decorativa"
          />
        </div>
      </div>
    </div>
  );
};

export default MainMenu;

import React from "react";
import "./../styles/Header.css";

const Header = () => {
    return (
      <header className="app-header">
        <div className="logo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3722/3722047.png"
            alt="Logo"
          />
          <h1>Repositorio de Fotos</h1>
        </div>
      </header>
    );
  };
  
  export default Header;
  
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/EscogerRol.css";
import logo from "../../assets/logo.png";

const EscogerRol = () => {
  const navigate = useNavigate();

  return (
    <div className="escoger-rol-container">
      <div className="escoger-rol-box">
        <img src={logo} alt="Logo" className="logo-rol" />
        <h2>Escoga un rol</h2>
        <div className="rol-buttons">
          <button onClick={() => navigate("/RegistroContratista")}>Contratista</button>
          <button onClick={() => navigate("/RegistroPrestador")}>Prestador</button>
        </div>
      </div>
    </div>
  );
};

export default EscogerRol;


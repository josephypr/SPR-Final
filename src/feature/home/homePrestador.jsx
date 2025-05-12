import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/homePrestador.css";
import logo from "../../assets/logo.png";
import perfil from "../../assets/perfil.png";

const HomePrestador = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showPostulacion, setShowPostulacion] = useState(false);
  const navigate = useNavigate();

  const handlePerfilClick = () => setShowMenu(!showMenu);
  const handleCerrarSesion = () => (window.location.href = "/");
  const handleIrPerfil = () => navigate("/perfil");

  return (
    <div className="home">
      <header className="header">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        />
        <div className="usuario" onClick={handlePerfilClick}>
          <span className="nombre-usuario">Usuario</span>
          <img src={perfil} alt="Perfil" className="perfil-icono" />
          {showMenu && (
            <div className="menu-desplegable">
              <button onClick={handleIrPerfil}>Perfil</button>
              <button onClick={handleCerrarSesion}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="contenido">
        <aside className="sidebar">
          <h3>Categoría</h3>
          <ul>
            <li>Tecnología</li>
          </ul>

          <h3>Ordenar por</h3>
          <select>
            <option>Relevancia</option>
            <option>Estudios Universitarios</option>
            <option>Mejor Calificacion</option>
          </select>
        </aside>

        <section className="seccion-servicios">
          <button className="postular-btn" onClick={() => setShowPostulacion(true)}>
            Postular servicio
          </button>
          {showPostulacion && (
            <div className="mini-perfil">
              <h4>Mi perfil</h4>
              <img src={perfil} alt="Mi perfil" className="perfil-icono" />
              <p>Nombre del usuario</p>
              <p>Descripcion</p>
              <p>Calificacion</p>
              <button onClick={() => setShowPostulacion(false)}>Cerrar</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePrestador;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Home.css";
import logo from "../../assets/logo.png";
import perfil from "../../assets/perfil.png";
import hardware from "../../assets/hardware.jpg"
import software from "../../assets/software.jpg"

const servicios = [
  // { img: servicio1, nombre: "Matenimiento de pc", precio: "20.000" }
  { img: hardware, nombre: "Mantenimiento de hardware de pc" },
  { img: software, nombre: "Mantenimiento de software de pc" },

];

const Home = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handlePerfilClick = () => setShowMenu(!showMenu);
  const handleCerrarSesion = () => (window.location.href = "/");
  const handleIrPerfil = () => navigate("/perfil");

  return (
    <div className="home">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
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
        </aside>

        <section className="seccion-servicios">
          <div className="grid-servicios">
            {servicios.map((s, index) => (
              <div key={index} className="card-servicio">
                <img src={s.img} alt={s.nombre} />
                <h4 style={{ textAlign: 'center' }}>{s.nombre}</h4> {/* Añadido estilo para centrar */}
                <button onClick={() => navigate('/homePrestador')}>Prestadores</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

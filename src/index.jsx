import { useNavigate } from "react-router-dom";
import "../src/styles/index.css";
import logo from "../src/assets/logo.png";


const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      <header className="header">
        <h1 className="spr">SPR</h1>
        <div className="header-buttons">
          <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
          <button onClick={() => navigate("/Registro")}>Registrarse</button>
        </div>
      </header>

      <div className="info-section">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="title">¿Quiénes Somos?</h2>
        <p className="description">
          Somos una página confiable, creada por estudiantes del SENA. Esta página va a hacer una conexión entre el contratista y el prestador de servicios, con el fin de que el prestador de servicios suba en lo que se especializa y el contratista pueda adquirir sus servicios.
        </p>
      </div>

      <div className="servicios-seccion">
        <h2 className="title-servicios">NUESTROS SERVICIOS</h2>
        <div className="imagenes-grid">
          <div className="card-servicio">
            <img alt="hardware" src="/src/assets/hardware.jpg" />
            <h3>Reparación de hardware</h3>
          </div>
          <div className="card-servicio">
            <img alt="software" src="/src/assets/software.jpg" />
            <h3>Soporte de software</h3>
          </div>
        </div>
      </div>

      <div className="info-section extra-section">
        <h2 className="title">OBJETIVO PRINCIPAL</h2>
        <p className="description centrado">
          En esta página se podrá brindar y contratar servicios. Aquí habrá una conexión segura y eficiente entre contratista y prestador de servicios.
        </p>

        <h2 className="title">ALCANCE</h2>
        <div className="alcance-container">
          <p className="description alcance-izquierda">
            Nuestro alcance se centra en facilitar a los proveedores que incrementen sus ingresos al tener mayor visibilidad y acceso a una base de clientes más amplia, también en proporcionar igualdad de oportunidades para profesionales y trabajadores informales,
          </p>
          <p className="description alcance-derecha">
            ayudando a reducir la desigualdad económica creando un entorno de confianza mediante calificaciones y reseñas acerca de los proveedores de servicios y contratantes, asegurando la calidad de los servicios ofrecidos.
          </p>
        </div>
      </div>

      <footer className="footer">
        <h2 className="footer-title">DESARROLLADORES</h2>
        <p className="footer-text">Joseph Prieto / Isabella Ramirez / Andrey Santa<br />2823510g2</p>
      </footer>
    </>
  );
};

export default Index;

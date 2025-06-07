import React, { useState, useEffect } from "react"; // Agregamos useEffect para la carga de datos
import { useNavigate } from "react-router-dom";
import "../../styles/homePrestador.css";
import logo from "../../assets/logo.png";
import defaultPerfilIcon from "../../assets/perfil.png"; // Usamos defaultPerfilIcon para mayor claridad
import hardware from "../../assets/hardware.jpg";
import software from "../../assets/software.jpg";

const servicios = [
  { img: hardware, nombre: "Mantenimiento de hardware de pc" },
  { img: software, nombre: "Mantenimiento de software de pc" },
];

const HomePrestador = () => { // Renombrado a HomePrestador para ser consistente
  const [showMenu, setShowMenu] = useState(false);
  const [prestadorInfo, setPrestadorInfo] = useState(null); // Nuevo estado para la información del prestador
  const navigate = useNavigate();

  // Obtener credenciales del usuario
  const cedula = localStorage.getItem("cedula");
  const token = localStorage.getItem("token");
  const prestadorEndpoint = `/api/prestador/${cedula}`; // Asegúrate de que esta sea la ruta correcta de tu API

  // Cargar datos del prestador
  useEffect(() => {
    const fetchPrestadorInfo = async () => {
      if (!cedula || !token) {
        console.error("Credenciales no encontradas, redirigiendo a login.");
        navigate("/login"); // Asegúrate de que esta sea la ruta de tu login
        return;
      }

      try {
        const res = await fetch(prestadorEndpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          if (res.status === 401) {
            alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
            localStorage.clear();
            navigate("/login");
          } else {
            const errorData = await res.json();
            throw new Error(errorData.mensaje || "Error al obtener información del prestador.");
          }
        }

        const data = await res.json();
        setPrestadorInfo(data);
      } catch (err) {
        console.error("Error al cargar la información del prestador:", err);
        // Puedes mostrar un mensaje al usuario si la carga falla
        // alert("Hubo un error al cargar tu información de perfil.");
      }
    };

    fetchPrestadorInfo();
  }, [cedula, token, prestadorEndpoint, navigate]); // Dependencias para el useEffect

  const handlePerfilClick = () => setShowMenu(!showMenu);
  const handleCerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/"; // Redirige a la página de inicio o login después de cerrar sesión
  };
  const handleIrPerfil = () => navigate("/perfil"); // Esta ruta es para tu perfil general

  return (
    <div className="home">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" onClick={() => navigate("/homePrestador")} style={{ cursor: "pointer" }} />
        <div className="usuario" onClick={handlePerfilClick}>
          <span className="nombre-usuario">
            {prestadorInfo ? `${prestadorInfo.nombres} ${prestadorInfo.apellidos}` : "Cargando..."}
          </span>
          <img
            src={prestadorInfo?.foto || defaultPerfilIcon}
            alt="Perfil"
            className="perfil-icono"
          />
          {showMenu && (
            <div className="menu-desplegable">
              <button onClick={handleIrPerfil}>Mi Perfil</button>
              <button onClick={handleCerrarSesion}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="contenido">
        <aside className="sidebar">
          <div className="sidebar-category-section">
            <h3>Categoría</h3>
            <ul>
              <li>Tecnología</li>
              {/* Agrega más categorías si es necesario */}
            </ul>
          </div>
          <button
            className="portafolio-btn"
            onClick={() => navigate('/portafolio')}
          >
            Portafolio
          </button>
        </aside>

        <section className="seccion-servicios">
          <div className="grid-servicios">
            {servicios.map((s, index) => (
              <div key={index} className="card-servicio">
                <img src={s.img} alt={s.nombre} />
                <h4 style={{ textAlign: 'center' }}>{s.nombre}</h4>
                <button onClick={() => navigate('/homePrestadorperfiles')}>Prestadores</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePrestador; // Exporta con el nuevo nombre
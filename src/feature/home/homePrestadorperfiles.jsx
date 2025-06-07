import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/homePrestadorperfiles.css"; // CSS específico para el prestador
import logo from "../../assets/logo.png";
import defaultPerfilIcon from "../../assets/perfil.png";

// Renombramos el componente a HomePrestadorPerfiles para ser más específico
const HomePrestadorPerfiles = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showPostulacion, setShowPostulacion] = useState(false); // Mantener para el botón "Postular servicio"
  const [prestadorInfo, setPrestadorInfo] = useState(null); // Info del PRESTADOR logueado
  const navigate = useNavigate();

  // Obtener credenciales del prestador logueado
  const cedula = localStorage.getItem("cedula");
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol"); // Asumimos que aquí el rol es "prestador"

  // Endpoint para cargar la información del prestador
  const prestadorEndpoint = `/api/prestador/${cedula}`;

  // Cargar datos del prestador para el encabezado
  useEffect(() => {
    const fetchPrestadorInfo = async () => {
      if (!cedula || !token || rol !== "prestador") { // Verificar que el rol sea "prestador"
        console.error("Credenciales o rol incorrecto. Redirigiendo a login.");
        localStorage.clear();
        navigate("/login");
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
        alert("Error al cargar tu perfil.");
      }
    };

    fetchPrestadorInfo();
  }, [cedula, token, rol, prestadorEndpoint, navigate]);

  // Handlers
  const handlePerfilClick = () => setShowMenu(!showMenu);
  
  const handleCerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleIrPerfil = () => {
    // Redirige al perfil del prestador
    navigate("/perfilPrestador"); // Asumiendo que esta es la ruta para el perfil completo del prestador
  };

  // Esta función es para el botón "Ver perfil" dentro del recuadro de postulación
  const handleVerPerfilDesdePostulacion = () => {
    navigate("/PerfilPortafolio"); // Ruta para el portafolio específico del prestador
    setShowPostulacion(false); 
  };

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => navigate("/homePrestador")} // Logo lleva al home del prestador
          style={{ cursor: "pointer" }}
        />

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

      {/* Contenido principal */}
      <main className="contenido">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-category-section">
            <h3>Categoría</h3>
            <ul>
              <li>Tecnología</li>
              {/* Agrega más categorías si es necesario */}
            </ul>
          </div>
        </aside>

        {/* Sección de servicios - CON BOTÓN "POSTULAR SERVICIO" */}
        <section className="seccion-servicios">
          <button className="postular-btn" onClick={() => setShowPostulacion(true)}>
            Postular servicio
          </button>

          {showPostulacion && (
            <div className="mini-perfil">
              {prestadorInfo ? (
                <>
                  <img src={prestadorInfo.foto || defaultPerfilIcon}
                       alt="Mi perfil" className="perfil-icono-grande" />
                  <h4>{prestadorInfo.nombres} {prestadorInfo.apellidos}</h4>
                  <p>{prestadorInfo.descripcion || "No hay descripción disponible"}</p>

                  <button
                    className="btn-ver-perfil"
                    onClick={handleVerPerfilDesdePostulacion} 
                  >
                    Ver perfil
                  </button>

                  {prestadorInfo.celular && (
                    <a href={`https://wa.me/${prestadorInfo.celular}`}
                       target="_blank" rel="noopener noreferrer"
                       className="whatsapp-link">
                      Contactar por WhatsApp
                    </a>
                  )}
                  <button className="btn-eliminar-postulacion" onClick={() => setShowPostulacion(false)}>Eliminar postulación</button>
                </>
              ) : (
                <p>Cargando información...</p>
              )}
            </div>
          )}
          
        </section>
      </main>
    </div>
  );
};

export default HomePrestadorPerfiles;
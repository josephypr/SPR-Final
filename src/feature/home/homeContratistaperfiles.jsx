import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/homeContratistaperfiles.css"; // CSS específico para el contratista
import logo from "../../assets/logo.png";
import defaultPerfilIcon from "../../assets/perfil.png";

// Renombramos el componente a HomeContratistaPerfiles para ser más específico
const HomeContratistaPerfiles = () => {
  const [showMenu, setShowMenu] = useState(false);
  // Eliminamos showPostulacion ya que este componente NO tendrá el botón "Postular servicio".
  // const [showPostulacion, setShowPostulacion] = useState(false); 
  const [contratistaInfo, setContratistaInfo] = useState(null); // Info del CONTRATISTA logueado
  const navigate = useNavigate();

  // Obtener credenciales del contratista logueado
  const cedula = localStorage.getItem("cedula");
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol"); // Asumimos que aquí el rol es "contratista"

  // Endpoint para cargar la información del contratista
  const contratistaEndpoint = `/api/contratista/${cedula}`;

  // Cargar datos del contratista para el encabezado
  useEffect(() => {
    const fetchContratistaInfo = async () => {
      if (!cedula || !token || rol !== "contratista") { // Verificar que el rol sea "contratista"
        console.error("Credenciales o rol incorrecto. Redirigiendo a login.");
        localStorage.clear();
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(contratistaEndpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          if (res.status === 401) {
            alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
            localStorage.clear();
            navigate("/login");
          } else {
            const errorData = await res.json();
            throw new Error(errorData.mensaje || "Error al obtener información del contratista.");
          }
        }

        const data = await res.json();
        setContratistaInfo(data);
      } catch (err) {
        console.error("Error al cargar la información del contratista:", err);
        alert("Error al cargar tu perfil.");
      }
    };

    fetchContratistaInfo();
  }, [cedula, token, rol, contratistaEndpoint, navigate]);

  // Handlers
  const handlePerfilClick = () => setShowMenu(!showMenu);
  
  const handleCerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleIrPerfil = () => {
    // Redirige al perfil del contratista
    navigate("/perfilContratista"); // Asumiendo que esta es la ruta para el perfil completo del contratista
  };

  // handleVerPerfilDesdePostulacion se elimina porque no hay botón de postulación aquí.
  // const handleVerPerfilDesdePostulacion = () => {
  //     navigate("/PerfilPortafolio"); 
  //     setShowPostulacion(false); 
  // };

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => navigate("/homeContratista")} // Logo lleva al home del contratista
          style={{ cursor: "pointer" }}
        />

        <div className="usuario" onClick={handlePerfilClick}>
          <span className="nombre-usuario">
            {contratistaInfo ? `${contratistaInfo.nombres} ${contratistaInfo.apellidos}` : "Cargando..."}
          </span>
          <img
            src={contratistaInfo?.foto || defaultPerfilIcon}
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

        {/* Sección de perfiles de prestadores (para el contratista) */}
        <section className="seccion-servicios">
          
        </section>
      </main>
    </div>
  );
};

export default HomeContratistaPerfiles;
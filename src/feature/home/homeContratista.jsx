import React, { useState, useEffect } from "react"; // Importamos useEffect
import { useNavigate } from "react-router-dom";
import "../../styles/homePrestador.css"; // Asegúrate de que este sea el archivo CSS correcto para HomeContratista
import logo from "../../assets/logo.png";
import defaultPerfilIcon from "../../assets/perfil.png"; // Usamos un nombre más claro para el ícono por defecto
import hardware from "../../assets/hardware.jpg";
import software from "../../assets/software.jpg";

const servicios = [
  { img: hardware, nombre: "Mantenimiento de hardware de pc" },
  { img: software, nombre: "Mantenimiento de software de pc" },
];

const HomeContratista = () => { // Cambiado el nombre de la constante a HomeContratista
  const [showMenu, setShowMenu] = useState(false);
  const [contratistaInfo, setContratistaInfo] = useState(null); // Estado para la información del CONTRATISTA
  const navigate = useNavigate();

  // Obtener credenciales del usuario (asumiendo que es un contratista)
  const cedula = localStorage.getItem("cedula"); // O el identificador que uses para el contratista
  const token = localStorage.getItem("token");
  // Asegúrate de que este endpoint sea el correcto para obtener la info del contratista
  const contratistaEndpoint = `/api/contratista/${cedula}`; 

  // Cargar datos del contratista al cargar el componente
  useEffect(() => {
    const fetchContratistaInfo = async () => {
      if (!cedula || !token) {
        console.warn("Credenciales de contratista no encontradas en localStorage. El perfil no se cargará.");
        // Opcional: Redirigir a login si las credenciales no están presentes
        // navigate("/login"); 
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
            navigate("/login"); // Asegúrate de que esta sea la ruta de tu login
          } else {
            const errorData = await res.json();
            throw new Error(errorData.mensaje || "Error al obtener información del contratista.");
          }
        }

        const data = await res.json();
        setContratistaInfo(data);
      } catch (err) {
        console.error("Error al cargar la información del contratista:", err);
        // Puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    };

    fetchContratistaInfo();
  }, [cedula, token, contratistaEndpoint, navigate]); // Dependencias del useEffect

  const handlePerfilClick = () => setShowMenu(!showMenu);
  const handleCerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/"; // Redirige a la página de inicio o login
  };
  const handleIrPerfil = () => navigate("/perfilContratista"); // Podría ser una ruta específica para el perfil del contratista

  return (
    <div className="home">
      <header className="header">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => navigate("/homeContratista")} // El logo te lleva a la página principal del contratista
          style={{ cursor: "pointer" }}
        />
        <div className="usuario" onClick={handlePerfilClick}>
          <span className="nombre-usuario">
            {contratistaInfo ? `${contratistaInfo.nombres} ${contratistaInfo.apellidos}` : "Cargando..."}
          </span>
          <img
            src={contratistaInfo?.foto || defaultPerfilIcon} // Usa la foto del contratista o la por defecto
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
        </aside>

        <section className="seccion-servicios">
          <div className="grid-servicios">
            {servicios.map((s, index) => (
              <div key={index} className="card-servicio">
                <img src={s.img} alt={s.nombre} />
                <h4 style={{ textAlign: 'center' }}>{s.nombre}</h4>
                <button onClick={() => navigate('/homeContratistaperfiles')}>Ver Prestadores</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeContratista; // Exporta con el nuevo nombre
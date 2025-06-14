import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/homePrestador.css"; // Puedes seguir usando los mismos estilos
import logo from "../../assets/logo.png";
import defaultPerfilIcon from "../../assets/perfil.png";

// Reutilizamos el mapa de imágenes y las importaciones
import hardware from "../../assets/hardware.jpg";
import software from "../../assets/software.jpg";

const imageMap = {
  1: software,
  2: hardware,
};

const HomeContratista = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [contratistaInfo, setContratistaInfo] = useState(null);
  const [servicios, setServicios] = useState([]); // Estado para los servicios cargados de la API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const cedula = localStorage.getItem("cedula");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!cedula || !token) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Hacemos las dos peticiones en paralelo para más eficiencia
        const [contratistaRes, serviciosRes] = await Promise.all([
          fetch(`/api/contratista/${cedula}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/categorias', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (!contratistaRes.ok) throw new Error("No se pudo cargar la información de tu perfil.");
        if (!serviciosRes.ok) throw new Error("No se pudieron cargar los servicios.");

        const contratistaData = await contratistaRes.json();
        const serviciosData = await serviciosRes.json();

        setContratistaInfo(contratistaData);
        setServicios(serviciosData);

      } catch (err) {
        setError(err.message);
        console.error("Error en la carga de datos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cedula, token, navigate]);

  const handleNavigateToPerfiles = (servicioSeleccionado) => {
    // Navegamos a la página de perfiles, pasando los datos del servicio en el 'state'
    navigate('/homePrestadorPerfiles', {
      state: {
        selectedCategoriaId: servicioSeleccionado.id_categoria,
        selectedCategoriaName: servicioSeleccionado.nombre_servicio,
      },
    });
  };

  const handlePerfilClick = () => setShowMenu(!showMenu);
  const handleCerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const handleIrPerfil = () => navigate("/perfilContratista");

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="home">
      <header className="header">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => navigate("/homeContratista")}
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

      <main className="contenido">
        <aside className="sidebar">
          <div className="sidebar-category-section">
            <h3>Categorías</h3>
            <ul>
              {/* Podríamos listar las categorías únicas aquí si quisiéramos */}
              <li>Tecnología</li>
            </ul>
          </div>
        </aside>

        <section className="seccion-servicios">
          <h2>Encuentra el Servicio que Necesitas</h2>
          <div className="grid-servicios">
            {servicios.map((servicio) => (
              <div key={servicio.id_categoria} className="card-servicio">
                <img src={imageMap[servicio.id_categoria]} alt={servicio.nombre_servicio} />
                <h4 style={{ textAlign: 'center' }}>{servicio.nombre_servicio}</h4>
                {/* El botón ahora llama a la función correcta para navegar con datos */}
                <button onClick={() => handleNavigateToPerfiles(servicio)}>
                  Ver Prestadores
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeContratista;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/homePrestador.css";
import logo from "../../assets/logo.png";
import defaultPerfilIcon from "../../assets/perfil.png";

import hardware from "../../assets/hardware.jpg";
import software from "../../assets/software.jpg";

// El mapa que asocia cada ID de la base de datos con una imagen local.
const imageMap = {
  1: software, // El servicio con ID 1 es Software
  2: hardware, // El servicio con ID 2 es Hardware
};

const HomePrestador = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [prestadorInfo, setPrestadorInfo] = useState(null);
  const [servicios, setServicios] = useState([]);
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

        const [prestadorRes, serviciosRes] = await Promise.all([
          fetch(`/api/prestador/${cedula}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/categorias', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!prestadorRes.ok || !serviciosRes.ok) {
          throw new Error("Hubo un problema al cargar los datos iniciales.");
        }

        const prestadorData = await prestadorRes.json();
        const serviciosData = await serviciosRes.json();

        setPrestadorInfo(prestadorData);
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

  const handlePerfilClick = () => setShowMenu(!showMenu);

  const handleCerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  
  const handleIrPerfil = () => navigate("/perfilPrestador");

  const handleNavigateToPostulacion = (servicioSeleccionado) => {
    navigate('/homePrestadorperfiles', {
      state: {
        selectedCategoriaId: servicioSeleccionado.id_categoria,
        selectedCategoriaName: servicioSeleccionado.nombre_servicio,
      },
    });
  };

  const uniqueCategories = [...new Set(servicios.map(s => s.nombre_categoria))];

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
          onClick={() => navigate("/homePrestador")}
          style={{ cursor: "pointer" }}
        />
        <div className="usuario" onClick={handlePerfilClick}>
          <span className="nombre-usuario">
            {prestadorInfo ? `${prestadorInfo.nombres} ${prestadorInfo.apellidos}` : ""}
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
              {uniqueCategories.map(cat => <li key={cat}>{cat}</li>)}
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
            {servicios.length > 0 ? (
              servicios.map((servicio) => (
                <div key={servicio.id_categoria} className="card-servicio">
                  
                  {/* === LÍNEA CORREGIDA === */}
                  <img src={imageMap[servicio.id_categoria] || 'https://via.placeholder.com/300x200'} alt={servicio.nombre_servicio} />
                  
                  <h4 style={{ textAlign: 'center' }}>{servicio.nombre_servicio}</h4>
                  <button onClick={() => handleNavigateToPostulacion(servicio)}>
                    Prestadores
                  </button>
                </div>
              ))
            ) : (
              <p>No hay servicios disponibles en este momento.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePrestador;
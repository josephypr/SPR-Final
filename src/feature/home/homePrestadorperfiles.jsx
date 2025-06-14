import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/homePrestadorPerfiles.css";
import logo from "../../assets/logo.png";
import defaultPerfilIcon from "../../assets/perfil.png";

const HomePrestadorPerfiles = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [listaPostulaciones, setListaPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const selectedService = location.state;
  const cedula = localStorage.getItem("cedula");
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  const loadPageData = useCallback(async () => {
    if (!selectedService) {
      alert("Por favor, selecciona un servicio desde la página principal.");
      const homeRoute = rol === 'prestador' ? '/homePrestador' : '/homeContratista';
      navigate(homeRoute);
      return;
    }
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Corregimos las rutas para que usen el proxy de Vite correctamente
      const userApiEndpoint = rol === 'prestador' ? `/api/prestador/${cedula}` : `/api/contratista/${cedula}`;

      const [userRes, postulacionesRes] = await Promise.all([
        fetch(userApiEndpoint, { headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' } }),
        fetch(`/api/postulaciones?categoria_id=${selectedService.selectedCategoriaId}`, { headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' } })
      ]);

      if (!userRes.ok) throw new Error("No se pudo cargar tu información de perfil.");
      const userData = await userRes.json();
      setCurrentUserInfo(userData);

      if (postulacionesRes.status === 404) {
        setListaPostulaciones([]);
      } else if (!postulacionesRes.ok) {
        throw new Error("No se pudieron cargar las postulaciones del servicio.");
      } else {
        const postulacionesData = await postulacionesRes.json();
        setListaPostulaciones(postulacionesData);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error en la carga de datos:", err);
    } finally {
      setLoading(false);
    }
  }, [cedula, token, rol, navigate, selectedService]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const handleGuardarPostulacion = async () => {
    if (!currentUserInfo?.descripcion) {
      alert("Necesitas una descripción en tu perfil para poder postularte.");
      return;
    }
    try {
      const res = await fetch("/api/postulaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          descripcion: currentUserInfo.descripcion,
          categoria_id: selectedService.selectedCategoriaId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al guardar la postulación.");

      alert("¡Felicidades! Te has postulado exitosamente.");
      loadPageData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAnularPostulacion = async (idPostulacion) => {
    if (!window.confirm("¿Estás seguro de que quieres anular esta postulación?")) return;
    try {
      const res = await fetch(`/api/postulacion/${idPostulacion}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al anular la postulación.");

      alert(data.mensaje);
      loadPageData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePerfilClick = () => setShowMenu(!showMenu);
  const handleCerrarSesion = () => { localStorage.clear(); window.location.href = "/"; };
  const handleIrPerfil = () => navigate(rol === 'prestador' ? "/perfilPrestador" : "/perfilContratista");

  // --- NUEVA FUNCIÓN PARA NAVEGAR AL PORTAFOLIO DE UN PRESTADOR ---
  const handleVerPortafolio = (cedulaPrestador) => {
  navigate(`/perfilPortafolio/${cedulaPrestador}`);
};


  if (loading) return <div className="loading-container">Cargando...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;

  const yaPostulado = currentUserInfo && listaPostulaciones.some(p => p.prestador.cedula === currentUserInfo.cedula);
  const miPostulacion = yaPostulado ? listaPostulaciones.find(p => p.prestador.cedula === currentUserInfo.cedula) : null;

  return (
    <div className="home">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" onClick={() => navigate(rol === 'prestador' ? "/homePrestador" : "/homeContratista")} style={{ cursor: "pointer" }} />
        <div className="usuario" onClick={handlePerfilClick}>
          <span className="nombre-usuario">{currentUserInfo ? `${currentUserInfo.nombres} ${currentUserInfo.apellidos}` : ""}</span>
          <img src={currentUserInfo?.foto || defaultPerfilIcon} alt="Perfil" className="perfil-icono" />
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
          {/* SECCIÓN DE CATEGORÍA AHORA ESTÁ ARRIBA */}
          <div className="sidebar-category-section">
            <h3>Servicio</h3>
            <p className="servicio-seleccionado">{selectedService?.selectedCategoriaName || 'Ninguno'}</p>
          </div>

          {/* BOTÓN btn-volver3 AHORA ESTÁ ABAJO */}
          <button className="btn-volver3" onClick={() => navigate(rol === 'prestador' ? '/homePrestador' : '/homeContratista')}>&larr; Volver</button>
        </aside>

        <section className="seccion-servicios">
          <h2>Prestadores para {selectedService?.selectedCategoriaName}</h2>

          {rol === 'prestador' && !yaPostulado && (
            <div className="caja-postulacion">
              <h3>¿Quieres ofrecer tus servicios aquí?</h3>
              <p>Tu perfil se mostrará con la descripción que ya tienes. ¡Postúlate con un solo clic!</p>
              <button className="btn-postularme-aqui" onClick={handleGuardarPostulacion}>
                Postularme a este Servicio
              </button>
            </div>
          )}

          <hr className="seccion-divider" />

          <h3>Perfiles Postulados</h3>
          <div className="grid-mis-postulaciones">
            {listaPostulaciones.length > 0 ? (
              listaPostulaciones.map((postulacion) => {
                const esMiPostulacion = currentUserInfo && postulacion.prestador.cedula === currentUserInfo.cedula;
                return (
                  <div key={postulacion.id_postulacion} className={`mini-perfil-postulacion ${esMiPostulacion ? 'mi-postulacion' : ''}`}>
                    <div className="perfil-header">
                      <img src={postulacion.prestador.foto || defaultPerfilIcon} alt="Perfil" className="perfil-icono-pequeno"/>
                      <div className="perfil-info">
                        <h5>{`${postulacion.prestador.nombres} ${postulacion.prestador.apellidos}`}</h5>
                        {esMiPostulacion && <span>(Esta es tu postulación)</span>}
                      </div>
                    </div>
                    <p className="perfil-descripcion">{postulacion.descripcion}</p>

                    {/* --- BOTÓN AÑADIDO --- */}
                    <button
                        className="btn-ver-portafolio"
                        onClick={() => handleVerPortafolio(postulacion.prestador.cedula)}
                    >
                      Ver Portafolio
                    </button>

                    {esMiPostulacion && miPostulacion ? (
                       <button className="btn-anular" onClick={() => handleAnularPostulacion(miPostulacion.id_postulacion)}>
                         Anular mi Postulación
                       </button>
                    ) : (
                      <a href={`https://wa.me/${postulacion.whatsapp}`} target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                         Contactar por WhatsApp
                      </a>
                    )}
                  </div>
                );
              })
            ) : (
              <p>Nadie se ha postulado a este servicio todavía. {rol === 'prestador' && '¡Sé el primero!'}</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePrestadorPerfiles;
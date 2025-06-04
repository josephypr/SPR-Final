import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/homePrestador.css";
import logo from "../../assets/logo.png";
import whatsappIcon from "../../assets/whatsapp.png";
import defaultPerfilIcon from "../../assets/perfil.png";

const HomePrestador = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [showPostulacion, setShowPostulacion] = useState(false);
    const [prestadorInfo, setPrestadorInfo] = useState(null);
    const navigate = useNavigate();

    // Obtener credenciales del usuario
    const cedula = localStorage.getItem("cedula");
    const token = localStorage.getItem("token");
    const prestadorEndpoint = `/api/prestador/${cedula}`;

    // Cargar datos del prestador
    useEffect(() => {
        const fetchPrestadorInfo = async () => {
            if (!cedula || !token) {
                console.error("Credenciales no encontradas");
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
                        throw new Error(errorData.mensaje || "Error al obtener información");
                    }
                }

                const data = await res.json();
                setPrestadorInfo(data);
            } catch (err) {
                console.error("Error:", err);
                alert("Error al cargar tu perfil");
            }
        };

        fetchPrestadorInfo();
    }, [cedula, token, prestadorEndpoint, navigate]);

    // Handlers
    const handlePerfilClick = () => setShowMenu(!showMenu);
    const handleCerrarSesion = () => {
        localStorage.clear();
        window.location.href = "/";
    };
    const handleIrPerfil = () => navigate("/perfil");

    return (
        <div className="home">
            {/* Header */}
            <header className="header">
                <img src={logo} alt="Logo" className="logo" 
                     onClick={() => navigate("/home")} style={{ cursor: "pointer" }} />
                
                <div className="usuario" onClick={handlePerfilClick}>
                    <span className="nombre-usuario">
                        {prestadorInfo ? `${prestadorInfo.nombres} ${prestadorInfo.apellidos}` : "Cargando..."}
                    </span>
                    <img src={prestadorInfo?.foto || defaultPerfilIcon} 
                         alt="Perfil" className="perfil-icono" />
                    
                    {showMenu && (
                        <div className="menu-desplegable">
                            <button onClick={handleIrPerfil}>Perfil</button>
                            <button onClick={handleCerrarSesion}>Cerrar sesión</button>
                        </div>
                    )}
                </div>
            </header>

            {/* Contenido principal */}
            <main className="contenido">
                {/* Sidebar */}
                <aside className="sidebar">
                    <h3>Categoría</h3>
                    <ul>
                        <li>Tecnología</li>
                        {/* Agrega más categorías si es necesario */}
                    </ul>

                    <h3>Ordenar por</h3>
                    <select>
                        <option>Relevancia</option>
                        <option>Estudios Universitarios</option>
                        {/* Agrega más opciones de ordenamiento */}
                    </select>
                </aside>

                {/* Sección de servicios */}
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
                                    
                                    {prestadorInfo.celular && (
                                        <a href={`https://wa.me/${prestadorInfo.celular}`} 
                                           target="_blank" rel="noopener noreferrer"
                                           className="whatsapp-link">
                                            <img src={whatsappIcon} alt="WhatsApp" className="whatsapp-icono" />
                                            Contactar por WhatsApp
                                        </a>
                                    )}
                                </>
                            ) : (
                                <p>Cargando información...</p>
                            )}
                            <button onClick={() => setShowPostulacion(false)}>Eliminar postulación</button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default HomePrestador;
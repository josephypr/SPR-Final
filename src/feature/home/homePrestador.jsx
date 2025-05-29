import React, { useState, useEffect } from "react"; // Asegúrate de importar useEffect
import { useNavigate } from "react-router-dom";
import "../../styles/homePrestador.css";
import logo from "../../assets/logo.png";
import whatsappIcon from "../../assets/whatsapp.png"; 

// Importa tu imagen de perfil por defecto si la tienes, o usa una URL genérica
import defaultPerfilIcon from "../../assets/perfil.png"; 

const HomePrestador = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [showPostulacion, setShowPostulacion] = useState(false);
    const [prestadorInfo, setPrestadorInfo] = useState(null); // Nuevo estado para la info del prestador
    const navigate = useNavigate();

    // Obtener la cédula y el token del localStorage
    const cedula = localStorage.getItem("cedula");
    const token = localStorage.getItem("token");

    // Endpoint para obtener la información del prestador logeado
    const prestadorEndpoint = `/api/prestador/${cedula}`;

    // useEffect para cargar la información del prestador cuando el componente se monta
    useEffect(() => {
        const fetchPrestadorInfo = async () => {
            if (!cedula || !token) {
                console.error("Cédula o token no encontrados en localStorage.");
                navigate("/login"); // Redirigir si no hay credenciales
                return;
            }

            try {
                const res = await fetch(prestadorEndpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    // Si la respuesta no es OK (ej. 401, 404, 500)
                    if (res.status === 401) {
                        alert("Sesión expirada o no autorizado. Por favor, inicia sesión de nuevo.");
                        localStorage.clear();
                        navigate("/login");
                    } else {
                        const errorData = await res.json();
                        throw new Error(errorData.mensaje || "Error al obtener la información del prestador.");
                    }
                }

                const data = await res.json();
                setPrestadorInfo(data); // Guarda la información en el estado
            } catch (err) {
                console.error("Error al cargar la información del prestador:", err);
                alert("Hubo un error al cargar tu perfil. Inténtalo de nuevo.");
            }
        };

        fetchPrestadorInfo();
    }, [cedula, token, prestadorEndpoint, navigate]); // Dependencias del useEffect

    const handlePerfilClick = () => setShowMenu(!showMenu);
    const handleCerrarSesion = () => {
        localStorage.clear(); // Limpia todo el localStorage
        window.location.href = "/"; // Redirige al inicio (o login)
    };
    const handleIrPerfil = () => navigate("/perfil");

    return (
        <div className="home">
            <header className="header">
                <img
                    src={logo}
                    alt="Logo"
                    className="logo"
                    onClick={() => navigate("/home")}
                    style={{ cursor: "pointer" }}
                />
                <div className="usuario" onClick={handlePerfilClick}>
                    {/* Muestra el nombre real del usuario si está disponible */}
                    <span className="nombre-usuario">
                        {prestadorInfo ? prestadorInfo.nombres : "Cargando..."}
                    </span>
                    <img
                        src={prestadorInfo && prestadorInfo.foto ? prestadorInfo.foto : defaultPerfilIcon}
                        alt="Perfil"
                        className="perfil-icono"
                    />
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

                    <h3>Ordenar por</h3>
                    <select>
                        <option>Relevancia</option>
                        <option>Estudios Universitarios</option>
                    </select>
                </aside>

                <section className="seccion-servicios">
                    <button className="postular-btn" onClick={() => setShowPostulacion(true)}>
                        Postular servicio
                    </button>
                    {showPostulacion && (
                        <div className="mini-perfil">
                            {prestadorInfo ? (
                                <>
                                    {/* Muestra la foto real del prestador */}
                                    <img
                                        src={prestadorInfo.foto || defaultPerfilIcon}
                                        alt="Mi perfil"
                                        className="perfil-icono-grande" // Puedes necesitar una clase CSS más grande
                                    />
                                    {/* Muestra el nombre real del prestador */}
                                    <h4>{prestadorInfo.nombres} {prestadorInfo.apellidos}</h4> 
                                    
                                    {/* Muestra la descripción real del prestador */}
                                    <p>{prestadorInfo.descripcion || "No hay descripción disponible."}</p>
                                    
                                    {/* Enlace de WhatsApp con el número de celular del prestador */}
                                    {prestadorInfo.celular && (
                                        <a 
                                            href={`https://wa.me/${prestadorInfo.celular}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="whatsapp-link"
                                        >
                                            <img
                                                src={whatsappIcon}
                                                alt="WhatsApp"
                                                className="whatsapp-icono"
                                            />
                                            Contactar por WhatsApp
                                        </a>
                                    )}
                                </>
                            ) : (
                                <p>Cargando información del prestador...</p>
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
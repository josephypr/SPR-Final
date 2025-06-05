import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Asegúrate de tener axios instalado: npm install axios
import "../../styles/PerfilPortafolio.css"; // Asegúrate de que este CSS sea el correcto

// La URL de tu API, debe ser la misma que en Portafolioprestador
const API_URL = "http://127.0.0.1:5000"; 

const PerfilPortafolio = () => {
    const [portafolios, setPortafolios] = useState([]); // Cambiado de portfolioImages a portafolios para consistencia
    const [isLoading, setIsLoading] = useState(true); // Inicia en true para mostrar "Cargando..."
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPortafolios = async () => {
            setIsLoading(true);
            setError(null); // Resetea el error en cada intento

            const token = localStorage.getItem("token");
            const cedula = localStorage.getItem("cedula"); // Asumiendo que necesitas la cédula del usuario logueado

            if (!token) {
                console.error("No hay token de autenticación.");
                navigate("/login"); // Redirige si no hay token
                return;
            }
            if (!cedula) {
                console.error("No hay cédula del usuario logueado.");
                // Decide qué hacer aquí: redirigir, mostrar error, etc.
                // Por ahora, solo loguea y termina.
                setError("No se pudo obtener la cédula del usuario.");
                setIsLoading(false);
                return;
            }

            try {
                // Haz la solicitud a tu API para obtener los servicios del portafolio.
                // Asumo que tu backend puede filtrar por cédula del prestador.
                // Si tu endpoint `/portafolio` ya devuelve solo el del usuario autenticado,
                // entonces la URL `/portafolio` es suficiente.
                // Si necesitas pasar la cédula como parámetro en la URL, sería algo como:
                // `${API_URL}/portafolio?cedula=${cedula}` o `${API_URL}/prestador/${cedula}/portafolio`
                const response = await axios.get(`${API_URL}/portafolio`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    // Si el backend necesita la cédula explícitamente en los parámetros de la URL, 
                    // y el endpoint es genérico para todos los portafolios:
                    // params: { cedula: cedula } 
                });
                
                setPortafolios(response.data); // Asume que la respuesta es un array de servicios
            } catch (err) {
                console.error("Error al obtener portafolios:", err.response?.data || err.message);
                if (err.response?.status === 401) {
                    alert("Sesión expirada o no autorizada. Por favor inicia sesión nuevamente.");
                    localStorage.removeItem("token");
                    localStorage.removeItem("cedula"); // Limpia también la cédula
                    navigate("/login");
                } else {
                    setError("Error al cargar los servicios del portafolio.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortafolios();
    }, [navigate]); // navigate como dependencia es buena práctica

    if (isLoading) {
        return (
            <div className="perfil-portafolio-container">
                <p>Cargando servicios del portafolio...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="perfil-portafolio-container">
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="perfil-portafolio-container">
            <h2>Mi Portafolio de Servicios</h2>

            {portafolios.length === 0 ? (
                <p className="no-images-message">No hay servicios publicados en este portafolio.</p>
            ) : (
                <div className="portfolio-grid">
                    {portafolios.map((servicio) => (
                        <div key={servicio.id_portafolio} className="portfolio-item">
                            {/* Asegúrate de que `servicio.imagenes` sea la URL accesible de la imagen */}
                            <img 
                                src={servicio.imagenes} 
                                alt={servicio.descripcion || "Servicio de portafolio"} 
                                className="portfolio-image" 
                            />
                            {/* Muestra la descripción si existe */}
                            {servicio.descripcion && (
                                <p className="portfolio-description">
                                    {servicio.descripcion}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PerfilPortafolio;
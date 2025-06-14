import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/PerfilPortafolio.css";

const API_URL = "http://127.0.0.1:5000";

const PerfilPortafolio = () => {
    const [portafolios, setPortafolios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { cedula } = useParams(); // <-- captura cedula de la URL dinámica

    useEffect(() => {
        const fetchPortafolios = async () => {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No hay token de autenticación.");
                navigate("/login");
                return;
            }

            try {
                // Si hay cédula en la URL, pedimos ese portafolio
                const endpoint = cedula
                    ? `${API_URL}/portafolio/${cedula}`
                    : `${API_URL}/portafolio`;

                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setPortafolios(response.data);
            } catch (err) {
                console.error("Error al obtener portafolios:", err.response?.data || err.message);
                if (err.response?.status === 401) {
                    alert("Sesión expirada o no autorizada. Por favor inicia sesión nuevamente.");
                    localStorage.removeItem("token");
                    localStorage.removeItem("cedula");
                    navigate("/login");
                } else {
                    setError("Error al cargar los servicios del portafolio.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortafolios();
    }, [navigate, cedula]);

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
            <h2>Portafolio</h2>

            {portafolios.length === 0 ? (
                <p className="no-images-message">No hay servicios publicados en este portafolio.</p>
            ) : (
                <div className="portfolio-grid">
                    {portafolios.map((servicio) => (
                        <div key={servicio.id_portafolio} className="portfolio-item">
                            <img 
                                src={servicio.imagenes} 
                                alt={servicio.descripcion || "Servicio de portafolio"} 
                                className="portfolio-image" 
                            />
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

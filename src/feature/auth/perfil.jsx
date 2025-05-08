import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const rol = localStorage.getItem("rol");

    if (rol === "contratista") {
      navigate("/PerfilContratista");
    } else if (rol === "prestador") {
      navigate("/PerfilPrestador");
    } else {
      navigate("/login"); // Si no hay rol, redirige al login
    }
  }, [navigate]);

  return null; // No muestra nada, solo redirige
};

export default Perfil;

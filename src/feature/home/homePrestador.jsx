import React, {useState} from "react";
import "../../styles/homePrestador.css"
import logo from "../../assets/logo.png";
import perfil from  "../../assets/perfil.png";

const HomePrestador = () => {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
  
    const handlePerfilClick = () => setShowMenu(!showMenu);
    const handleCerrarSesion = () => (window.location.href = "/");
    const handleIrPerfil = () => navigate("/perfil");
  
    return (
      <div className="home">
        <header className="header">
          <img src={logo} alt="Logo" className="logo" />
          <div className="usuario" onClick={handlePerfilClick}>
            <span className="nombre-usuario">Usuario</span>
            <img src={perfil} alt="Perfil" className="perfil-icono" />
            {showMenu && (
              <div className="menu-desplegable">
                <button onClick={handleIrPerfil}>Perfil</button>
                <button onClick={handleCerrarSesion}>Cerrar sesión</button>
              </div>
            )}
          </div>
         
        </header>
        </div>
        );
    };

    export default HomePrestador
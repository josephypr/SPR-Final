import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="titulo-login">Iniciar Sesión</h2>

        <select className="select-rol">
          <option value="">Selecciona un rol</option>
          <option value="contratista">Contratista</option>
          <option value="prestador">Prestador</option>
        </select>

        <input type="text" placeholder="Correo electrónico" />
        <input type="password" placeholder="Contraseña" />

        <div className="login-buttons">
          <button className="login-btn">Iniciar sesión</button>
          <button className="register-btn" onClick={() => navigate("/registro")}>
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

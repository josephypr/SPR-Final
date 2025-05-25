import "../styles/Registro.css";
import logo from "../assets/logo.png";

const Registro = () => {
  return (
    <div className="registro-container">
      <div className="registro-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="titulo-registro">Crear cuenta</h2>

        <select className="select-rol">
          <option value="">Selecciona un rol</option>
          <option value="contratista">Contratista</option>
          <option value="prestador">Prestador</option>
        </select>

        <input type="text" placeholder="Nombre" />
        <input type="text" placeholder="Apellido" />
        <input type="email" placeholder="Correo electrónico" />
        <input type="tel" placeholder="Teléfono" />
        <input type="password" placeholder="Contraseña" />
        <input type="password" placeholder="Confirmar contraseña" />

        <button className="registro-btn">Registrarme</button>
      </div>
    </div>
  );
};

export default Registro;

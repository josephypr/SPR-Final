import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/Login.css";
import logo from "../../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rol: '', 
    correo: '',
    contrasena: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { rol, correo, contrasena } = form;
  
    if (!rol) {
      alert('Por favor selecciona un rol');
      return;
    }

    // Convertir nombre de rol a ID
    const rolMap = {
      'contratista': 1,
      'prestador': 2
    };
    const rol_id = rolMap[rol.toLowerCase()];

    const url = 'http://localhost:5000/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena, rol: rol_id })  // <- ahora se envía rol_id
      });

      const data = await response.json();

      if (response.ok) {
        alert('Inicio de sesión exitoso');
        const token = data.token_de_acceso;

        localStorage.setItem("token", token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        const cedula = payload.sub || payload.identity;
        localStorage.setItem("cedula", cedula);
        localStorage.setItem("rol", rol); // Guardamos el nombre del rol

        navigate("/home");
      } else {
        alert(`Error al iniciar sesión: ${data.mensaje}`);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="login-title">Iniciar sesión</h2>

        <form onSubmit={handleSubmit}>
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="login-input"
            required
          >
            <option value="">Seleccionar rol</option>
            <option value="contratista">Contratista</option>
            <option value="prestador">Prestador</option>
          </select>

          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="login-input"
            required
          />

          <input
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
            placeholder="Contraseña"
            className="login-input"
            required
          />

          <div className="login-buttons">
            <button type="submit" className="btn-morado">
              Iniciar sesión
            </button>
            <button
              type="button"
              className="btn-morado"
              onClick={() => navigate("/registro")}
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

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
  const [touched, setTouched] = useState({}); // Para controlar qué campos han sido tocados
  const [error, setError] = useState('');

  const limites = {
    correo: { min: 6, max: 30 }, // Corregido: min 6, max 10
    contrasena: { min: 6, max: 30 },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const limit = limites[name];
    if (limit && value.length > limit.max) {
      return; // No permitir exceder el máximo
    }
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errores = false;
    const newTouched = { ...touched };
    let errorMensaje = '';

    // Validaciones de correo y contraseña
    if (!form.correo) {
      errorMensaje = "Por favor, ingresa tu correo electrónico";
      errores = true;
      newTouched.correo = true;
    } else if (form.correo.length < limites.correo.min || form.correo.length > limites.correo.max || !form.correo.includes('@')) {
      errorMensaje = `Correo inválido. Debe tener entre ${limites.correo.min} y ${limites.correo.max} caracteres y contener '@'`;
      errores = true;
      newTouched.correo = true;
    }

    if (!form.contrasena) {
      errorMensaje = "Por favor, ingresa tu contraseña";
      errores = true;
      newTouched.contrasena = true;
    } else if (form.contrasena.length < limites.contrasena.min || form.contrasena.length > limites.contrasena.max) {
      errorMensaje = `La contraseña debe tener entre ${limites.contrasena.min} y ${limites.contrasena.max} caracteres`;
      errores = true;
      newTouched.contrasena = true;
    }
    setTouched(newTouched);
    setError(errorMensaje);


    const { rol, correo, contrasena } = form;

    if (!rol) {
      alert('Por favor selecciona un rol');
      return;
    }

    if (errores) {
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
        body: JSON.stringify({ correo, contrasena, rol: rol_id }) // <- ahora se envía rol_id
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token_de_acceso;

        localStorage.setItem("token", token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        const cedula = payload.sub || payload.identity;
        localStorage.setItem("cedula", cedula);
        localStorage.setItem("rol", rol); // Guardamos el nombre del rol
        if(rol == "Contratista"){
          navigate("/homecontratista");
        }
        else{
          navigate("/home")
        }
        
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
            onBlur={handleBlur}
            placeholder="Correo electrónico"
            className="login-input"
            required
            maxLength={limites.correo.max} // Añadido maxLength
          />


          <input
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Contraseña"
            className="login-input"
            required
            maxLength={limites.contrasena.max} // Añadido maxLength
          />
          {error && <p className="error-message">{error}</p>}

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

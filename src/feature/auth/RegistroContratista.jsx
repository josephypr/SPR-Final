import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/RegistroContratista.css";
import logo from "../../assets/logo.png";
import axios from "axios";

const RegistroContratista = () => {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    celular: "",
    direccion: "",
    contrasena: "",
    correo: "",
    fecha_nacimiento: "",
    id_rol: "1", // Contratista
    foto: null,
    titulos_uni: "No requiere",
    descripcion: "",
  });

  const [touched, setTouched] = useState({});

  const limites = {
    nombres: { min: 3, max: 20 },
    apellidos: { min: 3, max: 20 },
    cedula: { min: 8, max: 10 },
    celular: { min: 10, max: 10 },
    direccion: { min: 5, max: 40 },
    contrasena: { min: 6, max: 30 },
    correo: { min: 6, max: 30 },
    descripcion: { min: 1, max: 100 },
  };

  const permitirSoloNumeros = (e) => {
    const key = e.key;
    if (!/^\d$/.test(key) && key !== "Backspace" && key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Tab") {
      e.preventDefault();
    }
  };

  const bloquearPegadoNoNumerico = (e) => {
    const texto = e.clipboardData.getData("text");
    if (!/^\d+$/.test(texto)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const limit = limites?.[name];

    if (limit && value.length > limit.max) {
      return;
    }

    if ((name === "nombres" || name === "apellidos") && !/^[a-zA-Z\s]*$/.test(value)) {
      return;
    }

    if ((name === "cedula" || name === "celular") && !/^\d*$/.test(value)) {
      return;
    }

    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleFileChange = (e) => {
    setFormulario((prev) => ({ ...prev, foto: e.target.files?.[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errores = false;
    const newTouched = { ...touched };
    for (const name in limites) {
      newTouched[name] = true; // Marcar todos los campos como "tocados" al intentar enviar
      if (formulario?.[name]?.length < limites?.[name]?.min) {
        alert(`El campo ${name} debe tener al menos ${limites?.[name]?.min} caracteres.`);
        errores = true;
      }
    }

    if (formulario.correo && !formulario.correo.includes("@")) {
      alert("El campo de correo electrónico debe contener el carácter '@'.");
      errores = true;
      newTouched.correo = true; // Mostrar error en el campo de correo
    }

    setTouched(newTouched);

    if (errores) {
      return;
    }

    const formData = new FormData();
    for (const campo in formulario) {
      formData.append(campo, formulario?.[campo]);
    }

    try {
      await axios.post("http://localhost:5000/signin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar usuario:", error.response?.data || error.message);
      alert("Error al registrar. Revisa los campos.");
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-box">
        <img src={logo} alt="Logo" className="registro-logo" />
        <h2 className="registro-titulo">Registro</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="nombres"
              value={formulario.nombres}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nombres"
              maxLength={limites.nombres.max}
              required
            />
            {touched.nombres && formulario.nombres.length < limites.nombres.min && (
              <small className="error">Mínimo {limites.nombres.min} caracteres</small>
            )}
          </div>
          <div>
            <input
              type="text"
              name="apellidos"
              value={formulario.apellidos}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Apellidos"
              maxLength={limites.apellidos.max}
              required
            />
            {touched.apellidos && formulario.apellidos.length < limites.apellidos.min && (
              <small className="error">Mínimo {limites.apellidos.min} caracteres</small>
            )}
          </div>
          <div>
            <input
              type="text"
              name="cedula"
              value={formulario.cedula}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={permitirSoloNumeros}
              onPaste={bloquearPegadoNoNumerico}
              placeholder="Cédula"
              maxLength={limites.cedula.max}
              required
            />
            {touched.cedula && formulario.cedula.length < limites.cedula.min && (
              <small className="error">Mínimo {limites.cedula.min} caracteres</small>
            )}
          </div>
          <div>
            <input
              type="text"
              name="celular"
              value={formulario.celular}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={permitirSoloNumeros}
              onPaste={bloquearPegadoNoNumerico}
              placeholder="Celular"
              maxLength={limites.celular.max}
              required
            />
            {touched.celular && formulario.celular.length < limites.celular.min && (
              <small className="error">Mínimo {limites.celular.min} caracteres</small>
            )}
          </div>
          <div>
            <input
              type="text"
              name="direccion"
              value={formulario.direccion}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Dirección"
              maxLength={limites.direccion.max}
              required
            />
            {touched.direccion && formulario.direccion.length < limites.direccion.min && (
              <small className="error">Mínimo {limites.direccion.min} caracteres</small>
            )}
          </div>
          <div>
            <input
              type="email"
              name="correo"
              value={formulario.correo}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Correo"
              maxLength={limites.correo.max}
              required
            />
            {touched.correo && formulario.correo.length < limites.correo.min && (
              <small className="error">Mínimo {limites.correo.min} caracteres</small>
            )}
            {touched.correo && formulario.correo && !formulario.correo.includes("@") && (
              <small className="error">Debe incluir el carácter '@'</small>
            )}
          </div>
          <div>
            <input
              type="password"
              name="contrasena"
              value={formulario.contrasena}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Contraseña"
              maxLength={limites.contrasena.max}
              required
            />
            {touched.contrasena && formulario.contrasena.length < limites.contrasena.min && (
              <small className="error">Mínimo {limites.contrasena.min} caracteres</small>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="fecha_nacimiento">Fecha De Nacimiento</label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formulario.fecha_nacimiento}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="foto" className="foto-label"> Foto De Perfil</label>
            <input type="file" name="foto" id="foto" accept="image/*" onChange={handleFileChange} className="foto-input" />
          </div>
          <div>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Descripción"
              maxLength={limites.descripcion.max}
            />
            {touched.descripcion && formulario.descripcion.length < limites.descripcion.min && (
              <small className="error">Mínimo {limites.descripcion.min} caracteres</small>
            )}
          </div>
          <button type="submit" className="registro-button">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default RegistroContratista;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/RegistroPrestador.css";
import axios from "axios";
import logo from "../../assets/logo.png";

const RegistroPrestador = () => {
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
    id_rol: "2", // prestador
    foto: null,
    titulos_uni: "",
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
    titulos_uni: { min: 1, max: 100 },
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
      newTouched[name] = true;
      if (formulario?.[name]?.length < limites?.[name]?.min) {
        alert(`El campo ${name} debe tener al menos ${limites?.[name]?.min} caracteres.`);
        errores = true;
      }
    }

    if (formulario.correo && !formulario.correo.includes("@")) {
      alert("El campo de correo electrónico debe contener el carácter '@'.");
      errores = true;
      newTouched.correo = true;
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
    <div className="container">
      <div className="form-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="title">Registro Prestador</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              name="cedula"
              placeholder="Cédula"
              value={formulario.cedula}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={permitirSoloNumeros}
              onPaste={bloquearPegadoNoNumerico}
              maxLength={limites.cedula.max}
              required
            />
            {touched.cedula && formulario.cedula.length < limites.cedula.min && (
              <small className="error">Mínimo {limites.cedula.min} caracteres</small>
            )}
          </div>
          <div className="input-box">
            <input
              type="text"
              name="nombres"
              placeholder="Nombres"
              value={formulario.nombres}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={limites.nombres.max}
              required
            />
            {touched.nombres && formulario.nombres.length < limites.nombres.min && (
              <small className="error">Mínimo {limites.nombres.min} caracteres</small>
            )}
          </div>
          <div className="input-box">
            <input
              type="text"
              name="apellidos"
              placeholder="Apellidos"
              value={formulario.apellidos}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={limites.apellidos.max}
              required
            />
            {touched.apellidos && formulario.apellidos.length < limites.apellidos.min && (
              <small className="error">Mínimo {limites.apellidos.min} caracteres</small>
            )}
          </div>
          <div className="input-box">
            <input
              type="text"
              name="celular"
              placeholder="Celular"
              value={formulario.celular}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={permitirSoloNumeros}
              onPaste={bloquearPegadoNoNumerico}
              maxLength={limites.celular.max}
              required
            />
            {touched.celular && formulario.celular.length < limites.celular.min && (
              <small className="error">Mínimo {limites.celular.min} caracteres</small>
            )}
          </div>
          <div className="input-box">
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={formulario.direccion}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={limites.direccion.max}
              required
            />
            {touched.direccion && formulario.direccion.length < limites.direccion.min && (
              <small className="error">Mínimo {limites.direccion.min} caracteres</small>
            )}
          </div>
          <div className="input-box">
            <input
              type="text"
              name="titulos_uni"
              placeholder="Títulos universitarios"
              value={formulario.titulos_uni}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={limites.titulos_uni.max}
              required
            />
            {touched.titulos_uni && formulario.titulos_uni.length < limites.titulos_uni.min && (
              <small className="error">Mínimo {limites.titulos_uni.min} caracteres</small>
            )}
          </div>
          <div className="input-box">
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={formulario.descripcion}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={limites.descripcion.max}
              required
            />
            {touched.descripcion && formulario.descripcion.length < limites.descripcion.min && (
              <small className="error">Mínimo {limites.descripcion.min} caracteres</small>
            )}
          </div>
          <div className="input-box">
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              value={formulario.correo}
              onChange={handleChange}
              onBlur={handleBlur}
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
          <div className="input-box form-group">
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
          <div className="input-box form-group">
            <label htmlFor="foto" style={{ outline: 'none' }}> Foto De Perfil</label>
            <input type="file" id="foto" name="foto" accept="image/*" onChange={handleFileChange} className="foto-input" />
          </div>
          <div className="input-box">
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={formulario.contrasena}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={limites.contrasena.max}
              required
            />
            {touched.contrasena && formulario.contrasena.length < limites.contrasena.min && (
              <small className="error">Mínimo {limites.contrasena.min} caracteres</small>
            )}
          </div>
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default RegistroPrestador;
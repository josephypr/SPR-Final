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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormulario((prev) => ({ ...prev, foto: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const campo in formulario) {
      formData.append(campo, formulario[campo]);
    }

    try {
      await axios.post("http://localhost:5000/signin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("¡Usuario registrado exitosamente!");
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
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="nombres"
              placeholder="Nombres"
              value={formulario.nombres}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="apellidos"
              placeholder="Apellidos"
              value={formulario.apellidos}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="celular"
              placeholder="Celular"
              value={formulario.celular}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={formulario.direccion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="titulos_uni"
              placeholder="Títulos universitarios"
              value={formulario.titulos_uni}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={formulario.descripcion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              value={formulario.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="date"
              name="fecha_nacimiento"
              value={formulario.fecha_nacimiento}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="file"
              name="foto"
              onChange={handleFileChange}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={formulario.contrasena}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default RegistroPrestador;

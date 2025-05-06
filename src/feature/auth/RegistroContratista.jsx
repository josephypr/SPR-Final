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
    titulos_uni: "No requiere", //se agrega para que lo mande a la bd debido a que ese usuario no requiere ingresar este campo
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
    <div className="registro-container">
      <div className="registro-box">
        <img src={logo} alt="Logo" className="registro-logo" />
        <h2 className="registro-titulo">Registro</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nombres" value={formulario.nombres} onChange={handleChange} placeholder="Nombres" required />
          <input type="text" name="apellidos" value={formulario.apellidos} onChange={handleChange} placeholder="Apellidos" required />
          <input type="text" name="cedula" value={formulario.cedula} onChange={handleChange} placeholder="Cédula" required />
          <input type="text" name="celular" value={formulario.celular} onChange={handleChange} placeholder="Celular" required />
          <input type="text" name="direccion" value={formulario.direccion} onChange={handleChange} placeholder="Dirección" required />
          <input type="email" name="correo" value={formulario.correo} onChange={handleChange} placeholder="Correo" required />
          <input type="password" name="contrasena" value={formulario.contrasena} onChange={handleChange} placeholder="Contraseña" required />
          <input type="date" name="fecha_nacimiento" value={formulario.fecha_nacimiento} onChange={handleChange} placeholder="Fecha de nacimiento" required />
         
          <input type="text" name="descripcion" value={formulario.descripcion} onChange={handleChange} placeholder="Descripción" />
          <input type="file" name="foto" accept="image/*" onChange={handleFileChange} className="foto-input" />
          <button type="submit" className="registro-button">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default RegistroContratista;

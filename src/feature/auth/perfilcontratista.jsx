import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/perfil.css";

const PerfilContratista = () => {
  const navigate = useNavigate();
  const cedula = localStorage.getItem("cedula");
  const token = localStorage.getItem("token");
  const endpoint = `/api/contratista/${cedula}`;
  const [usuario, setUsuario] = useState(null);
  const [original, setOriginal] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("No autorizado");
        const data = await res.json();
        setUsuario(data);
        setOriginal(data);
      } catch (err) {
        console.error(err);
        alert("Error al obtener perfil");
        navigate("/login");
      }
    };
    fetchUsuario();
  }, [endpoint, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(usuario)
      });
      if (!res.ok) throw new Error("Error al guardar");
      alert("Datos actualizados");
      setOriginal(usuario);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("No fue posible guardar los cambios");
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Eliminar tu cuenta?")) return;
    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status !== 204) throw new Error("Error al eliminar");
      alert("Cuenta eliminada");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar cuenta");
    }
  };

  const handleCancelar = () => {
    setUsuario(original);
    setEditing(false);
  };

  if (!usuario) return <div className="perfil-container">Cargando perfil...</div>;

  return (
    <div className="perfil-container">
      <h2 className="perfil-titulo">Perfil Contratista</h2>
      <form className="perfil-form" onSubmit={e => e.preventDefault()}>
        <img
          src={usuario.foto || "/default-profile.png"}
          alt="Foto de perfil"
          className="perfil-imagen"
        />
        <div className="perfil-group">
          <label>Nombres</label>
          <input
            name="nombres"
            value={usuario.nombres}
            onChange={handleChange}
            disabled={!editing}
            className="perfil-input"
          />
        </div>
        <div className="perfil-group">
          <label>Apellidos</label>
          <input
            name="apellidos"
            value={usuario.apellidos}
            onChange={handleChange}
            disabled={!editing}
            className="perfil-input"
          />
        </div>
        <div className="perfil-group">
          <label>Correo</label>
          <input
            name="correo"
            value={usuario.correo}
            onChange={handleChange}
            disabled={!editing}
            className="perfil-input"
          />
        </div>
        <div className="perfil-group">
          <label>Celular</label>
          <input
            name="celular"
            value={usuario.celular}
            onChange={handleChange}
            disabled={!editing}
            className="perfil-input"
          />
        </div>
        <div className="perfil-group">
          <label>Dirección</label>
          <input
            name="direccion"
            value={usuario.direccion}
            onChange={handleChange}
            disabled={!editing}
            className="perfil-input"
          />
        </div>
        <div className="perfil-group">
          <label>Fecha de nacimiento</label>
          <input
            name="fecha_nacimiento"
            type="date"
            value={usuario.fecha_nacimiento}
            onChange={handleChange}
            disabled={!editing}
            className="perfil-input"
          />
        </div>

        <div className="perfil-buttons">
          {!editing ? (
            <button type="button" className="btn btn-editar" onClick={() => setEditing(true)}>
              Editar
            </button>
          ) : (
            <>
              <button type="button" className="btn btn-guardar" onClick={handleGuardar}>
                Guardar
              </button>
              <button type="button" className="btn btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
            </>
          )}

          <button type="button" className="btn btn-volver" onClick={() => navigate("/home")}>
            Volver al inicio
          </button>

          <button type="button" className="btn btn-eliminar" onClick={handleEliminar}>
            Eliminar cuenta
          </button>
        </div>
      </form>
    </div>
  );
};

export default PerfilContratista;

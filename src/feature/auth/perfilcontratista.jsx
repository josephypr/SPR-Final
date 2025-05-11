import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/perfil.css";

const PerfilContratista = () => {

  const navigate = useNavigate();
  const cedula = localStorage.getItem("cedula");
  const token = localStorage.getItem("token");
  const endpoint = `/api/contratista/${cedula}`;
  const ratingEndpoint = `/api/contratista/${cedula}/calificaciones`;
  const [usuario, setUsuario] = useState(null);
  const [original, setOriginal] = useState(null);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState({ // Añade este estado
    promedio: 0,
    totalResenas: 0,
    detalles: []
  });

  useEffect(() => {
    const fetchUsuario = async () => { /* ... */ };
    const fetchRating = async () => { /* ... */ };

    fetchUsuario();
    fetchRating(); 
  }, [endpoint, ratingEndpoint, token, navigate]);

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

    
    const fetchRating = async () => {
      try {
        const res = await fetch(ratingEndpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRating({
            promedio: parseFloat(data.promedio) || 0,
            totalResenas: parseInt(data.totalResenas) || 0,
            detalles: data.detalles || []
          });
        }
      } catch (err) {
        console.error("Error al obtener calificaciones:", err);
      }
    };

    fetchUsuario();
  }, [endpoint, ratingEndpoint, token, navigate]);

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

  const renderStars = (ratingValue) => {
    const numericRating = typeof ratingValue === 'number' ? ratingValue : parseFloat(ratingValue) || 0;
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${numericRating >= star ? 'filled' : (numericRating >= star - 0.5 ? 'half' : '')}`}
          >
            ★
          </span>
        ))}
      </div>
    );
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


        {/* Sección de calificación */}
        <div className="rating-section">
          <h3>Calificación</h3>
          {rating.totalResenas > 0 ? (
            <>
              <div className="rating-display">
                {renderStars(rating.promedio)}
                <span className="rating-value">
                  {parseFloat(rating.promedio).toFixed(1)} ({rating.totalResenas} reseñas)
                </span>
              </div>
              {rating.detalles.length > 0 && (
                <div className="rating-details">
                  <h4>Últimas reseñas</h4>
                  <ul className="reviews-list">
                    {rating.detalles.slice(0, 3).map((review, index) => (
                      <li key={index} className="review-item">
                        <div className="review-header">
                          {renderStars(review.calificacion)}
                        </div>
                        {review.descripcion && (
                          <p className="review-comment">{review.descripcion}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="no-reviews">Aún no hay calificaciones</p>
          )}
        </div>
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

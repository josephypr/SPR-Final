import React, { useState, useEffect } from "react";
import "../../styles/Portafolio.css";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

const Portafolioprestador = () => {
  const [forms, setForms] = useState([{ description: "", image: null }]);
  const [portafolios, setPortafolios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar token al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado. Redirigiendo a login...");
      // Redirige al login si no hay token
      window.location.href = "/login";
    }
    fetchPortafolios();
  }, []);

  const fetchPortafolios = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${API_URL}/portafolio`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPortafolios(response.data);
    } catch (error) {
      console.error("Error al obtener portafolios:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Sesión expirada. Por favor inicia sesión nuevamente.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newForms = [...forms];
    newForms[index][name] = value;
    setForms(newForms);
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    const newForms = [...forms];
    newForms[index].image = file;
    setForms(newForms);
  };

  const handleAddForm = () => {
    setForms([...forms, { description: "", image: null }]);
  };

  const handleRemoveForm = (index) => {
    const newForms = forms.filter((_, i) => i !== index);
    setForms(newForms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("No estás autenticado");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();

      forms.forEach((form, index) => {
        if (form.description && form.image) {
          formData.append(`servicios[${index}][descripcion]`, form.description);
          formData.append(`servicios[${index}][imagen]`, form.image);
        }
      });

      const response = await axios.post(`${API_URL}/portafolio`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchPortafolios();
      setForms([{ description: "", image: null }]);
      alert("Portafolio guardado con éxito!");
    } catch (error) {
      console.error("Error al guardar:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Sesión expirada. Por favor inicia sesión nuevamente.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert("Error al guardar el portafolio. Verifica los datos.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePortafolio = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este servicio?")) return;
    
    try {
      await axios.delete(`${API_URL}/portafolio/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await fetchPortafolios();
      alert("Servicio eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error.response?.data || error.message);
      alert("Error al eliminar el servicio");
    }
  };

  return (
    <div className="portafolio-container">
      <h2>Mi Portafolio de Servicios</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {forms.map((form, index) => (
          <div key={index} className="servicio-item">
            <textarea
              name="description"
              placeholder="Describe tu servicio..."
              value={form.description}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e)}
              required
            />
            {forms.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveForm(index)}
                className="btn-eliminar"
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddForm} className="btn-agregar">
          ＋ Agregar otro servicio
        </button>
        <button type="submit" className="btn-guardar" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar Portafolio"}
        </button>
      </form>

      <div className="portafolios-guardados">
        <h3>Mis Servicios Publicados</h3>

        {isLoading ? (
          <p>Cargando...</p>
        ) : portafolios.length === 0 ? (
          <p>No hay servicios publicados aún</p>
        ) : (
          <div className="portafolios-list">
            {portafolios.map((portafolio) => (
              <div key={portafolio.id_portafolio} className="portafolio-item">
                <img
                  src={portafolio.imagenes}  // URL directa de Cloudinary
                  alt="Servicio"
                  className="portafolio-imagen"
                />
                <p className="portafolio-descripcion">
                  {portafolio.descripcion}
                </p>
                <button
                  className="btn-eliminar-porta"
                  onClick={() => handleDeletePortafolio(portafolio.id_portafolio)}
                  disabled={isLoading}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portafolioprestador;
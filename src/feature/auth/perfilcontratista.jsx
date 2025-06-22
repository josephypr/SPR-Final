import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/perfil.css";

const CLOUDINARY_CLOUD_NAME = "dymxlvysw"; 
const CLOUDINARY_UPLOAD_PRESET = "mi_perfil_unsigned"; 

const PerfilContratista = () => {
    const navigate = useNavigate();
    const cedula = localStorage.getItem("cedula");
    const token = localStorage.getItem("token");
    const endpoint = `/api/contratista/${cedula}`; 
    const ratingEndpoint = `/api/contratista/${cedula}/calificaciones`; 

    const [usuario, setUsuario] = useState(null);
    const [original, setOriginal] = useState(null);
    const [editing, setEditing] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [rating, setRating] = useState({
        promedio: 0,
        totalResenas: 0,
        detalles: []
    });

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
        fetchRating();
    }, [endpoint, ratingEndpoint, token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if ((name === "nombres" || name === "apellidos") && !/^[a-zA-Z\s]*$/.test(value)) {
            return;
        }

        if ((name === "celular" || name === "cedula") && !/^\d*$/.test(value)) {
            return;
        }

        setUsuario(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImageFile(e.target.files[0]);
        } else {
            setSelectedImageFile(null);
        }
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();
            if (response.ok) {
                return data.secure_url;
            } else {
                console.error("Error al subir la imagen a Cloudinary:", data);
                throw new Error(data.error.message || "Error al subir la imagen.");
            }
        } catch (error) {
            console.error("Error en la petición a Cloudinary:", error);
            throw error;
        }
    };
    
    const handleGuardar = async () => {
        let photoUrl = usuario.foto;

        if (selectedImageFile) {
            try {
                photoUrl = await uploadImageToCloudinary(selectedImageFile);
                console.log("Nueva imagen subida a Cloudinary:", photoUrl);
            } catch (error) {
                alert("Error al subir la nueva imagen. Inténtalo de nuevo.");
                return;
            }
        } else if (usuario.foto === null) {
            // Lógica si se quiere eliminar la foto, si no hay un botón específico, esto no se activará fácilmente
        }

        const datosParaEnviar = {
            ...usuario,
            foto: photoUrl
        };

        try {
            const res = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(datosParaEnviar)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.mensaje || "Error al guardar");
            }
            alert("Datos actualizados");
            setUsuario(datosParaEnviar);
            setOriginal(datosParaEnviar);
            setEditing(false);
            setSelectedImageFile(null);
        } catch (err) {
            console.error(err);
            alert("No fue posible guardar los cambios: " + err.message);
        }
    };

    const handleEliminar = async () => {
        if (!window.confirm("¿Eliminar tu cuenta? Esto es irreversible.")) return;
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
        setSelectedImageFile(null);
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
                    src={selectedImageFile ? URL.createObjectURL(selectedImageFile) : (usuario.foto || "/default-profile.png")}
                    alt="Foto de perfil"
                    className="perfil-imagen"
                />

                {editing && (
                    <div className="perfil-group">
                        <label htmlFor="fotoPerfil">Cambiar Foto de Perfil</label>
                        <input
                            id="fotoPerfil"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="perfil-input-file"
                        />
                    </div>
                )}

                

                <div className="perfil-group">
                    <label>Nombres</label>
                    <input
                        name="nombres"
                        value={usuario.nombres || ''}
                        onChange={handleChange}
                        disabled={!editing}
                        className="perfil-input"
                    />
                </div>
                <div className="perfil-group">
                    <label>Apellidos</label>
                    <input
                        name="apellidos"
                        value={usuario.apellidos || ''}
                        onChange={handleChange}
                        disabled={!editing}
                        className="perfil-input"
                    />
                </div>
                <div className="perfil-group">
                    <label>Correo</label>
                    <input
                        name="correo"
                        value={usuario.correo || ''}
                        onChange={handleChange}
                        disabled={!editing}
                        className="perfil-input"
                    />
                </div>
                <div className="perfil-group">
                    <label>Celular</label>
                    <input
                        name="celular"
                        value={usuario.celular || ''}
                        onChange={handleChange}
                        disabled={!editing}
                        className="perfil-input"
                    />
                </div>
                <div className="perfil-group">
                    <label>Dirección</label>
                    <input
                        name="direccion"
                        value={usuario.direccion || ''}
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
                        value={usuario.fecha_nacimiento || ''}
                        onChange={handleChange}
                        disabled={!editing}
                        className="perfil-input"
                    />
                </div>

                <div className="perfil-buttons">
                    {/* Contenedor para la fila superior de botones */}
                    <div className="perfil-buttons-top-row">
                        {editing ? (
                            <>
                                <button type="button" className="perfil-button btn-guardar" onClick={handleGuardar}>
                                    Guardar
                                </button>
                                <button type="button" className="perfil-button btn-cancelar" onClick={handleCancelar}>
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <button type="button" className="perfil-button btn-editar" onClick={() => setEditing(true)}>
                                Editar
                            </button>
                        )}
                        <button type="button" className="perfil-button btn-volver2" onClick={() => navigate("/homeContratista")}>
                            Volver al inicio
                        </button>
                    </div>

                    {/* Contenedor para la fila inferior del botón de eliminar */}
                    <div className="perfil-buttons-bottom-row">
                        <button type="button" className="perfil-button boton-eliminar" onClick={handleEliminar}>
                            Eliminar cuenta
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PerfilContratista;
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/UploadImage.css";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [alias, setAlias] = useState(""); // Estado para almacenar el alias
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  // Validar alias para evitar caracteres peligrosos
  const sanitizeAlias = (input) => {
    const regex = /^[a-zA-Z0-9_@.-]{1,50}$/; // Permite letras, números y algunos caracteres básicos, hasta 50 caracteres
    return regex.test(input);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setMessage("Elije una foto para poder subirla");
      return;
    }

    // Generar previsualización siempre
    setPreview(URL.createObjectURL(selectedFile));

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(selectedFile.type)) {
      setFile(null);
      setMessage("El archivo escogido no es del tipo imagen");
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setFile(null); // Evita que se pueda subir
      setMessage("La imagen pesa demasiado, intenta con otra");
      return;
    }

    // Si todo está bien, asignar archivo válido
    setFile(selectedFile);
    setMessage(""); // Limpiar mensajes anteriores
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!alias.trim()) {
      setMessage("El alias es obligatorio.");
      return;
    }

    if (!sanitizeAlias(alias)) {
      setMessage(
        "El alias contiene caracteres no permitidos. Usa solo letras, números y _ @ . -"
      );
      return;
    }

    if (!file) {
      setMessage("Elije una foto para poder subirla");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("alias", alias); // Incluir el alias

    try {
      await axios.post("http://localhost:4000/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(
        "¡Imagen subida correctamente, a la espera de ser aprobada por el Administrador!"
      );
      setFile(null);
      setPreview(null);
      setAlias(""); // Limpiar el alias después de subir
    } catch (err) {
      setMessage("Existió un error interno, espera un momento");
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Subir Imagen</h2>

      <div className="upload-grid">
        {/* Cuadro de previsualización */}
        <div className="preview-box">
          {preview ? (
            <img src={preview} alt="Previsualización" className="image-preview" />
          ) : (
            <p className="placeholder-text">Selecciona una imagen para previsualizarla aquí</p>
          )}
          {message && <p className={`upload-message ${file ? "success" : "error"}`}>{message}</p>}
        </div>

        {/* Formulario */}
        <div className="button-grid">
          {/* Input del alias */}
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="Ingresa tu alias"
            className="alias-input"
          />

          <label htmlFor="file-input" className="custom-file-input">
            {file ? file.name : "Seleccionar archivo"}
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <button
            onClick={handleUpload}
            className="upload-button"
            disabled={!file} // Deshabilitar si no hay un archivo válido
          >
            Subir
          </button>
          <Link to="/" className="back-button">
            Regresar al Menú Principal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;

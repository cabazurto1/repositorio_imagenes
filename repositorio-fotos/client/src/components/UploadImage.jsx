import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/UploadImage.css";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [alias, setAlias] = useState("");
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [extraInfo, setExtraInfo] = useState(null); // Información de sospecha

  const sanitizeAlias = (input) => {
    const regex = /^[a-zA-Z0-9_@.-]{1,50}$/;
    return regex.test(input);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setMessage("Elije una foto para poder subirla");
      return;
    }

    // Expresión regular para detectar caracteres sospechosos en el nombre del archivo
    const forbiddenChars = /[_]/;
    if (forbiddenChars.test(selectedFile.name)) {
      setFile(null);
      setMessage("El archivo contiene informacion sospechosa, posible esteganografía.");
      setExtraInfo({
        nombre: selectedFile.name,
        tipo: selectedFile.type,
        tamano: `${(selectedFile.size / 1024).toFixed(2)} KB`,
        esteganografia: "Posible presencia detectada" 
      });
      return;
    }

    setPreview(URL.createObjectURL(selectedFile));

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(selectedFile.type)) {
      setFile(null);
      setMessage("El archivo escogido no es del tipo imagen");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setFile(null);
      setMessage("La imagen pesa demasiado, intenta con otra");
      return;
    }

    setFile(selectedFile);
    setMessage("");
    setExtraInfo(null); // Limpia la información extra si la imagen es válida
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!alias.trim()) {
      setMessage("El alias es obligatorio.");
      return;
    }

    if (!sanitizeAlias(alias)) {
      setMessage("El alias contiene caracteres no permitidos.");
      return;
    }

    if (!file) {
      setMessage("Elije una foto para poder subirla");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("alias", alias);

    try {
      await axios.post("http://localhost:4000/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("¡Imagen subida correctamente, a la espera de ser aprobada!");
      setFile(null);
      setPreview(null);
      setAlias("");
      setExtraInfo(null);
    } catch (err) {
      setMessage("La imagen que trata de subir contiene archivos encriptados o está corrompida");
      setExtraInfo({
        nombre: file.name,
        tipo: file.type,
        tamano: `${(file.size / 1024).toFixed(2)} KB`,
        esteganografía: "Posible presencia detectada" 
      });
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Subir Imagen</h2>

      <div className="upload-grid">
        <div className="preview-box">
          {preview ? (
            <img src={preview} alt="Previsualización" className="image-preview" />
          ) : (
            <p className="placeholder-text">Selecciona una imagen para previsualizarla aquí</p>
          )}
          {message && <p className={`upload-message ${file ? "success" : "error"}`}>{message}</p>}
          {extraInfo && (
            <div className="extra-info">
              <p><strong>Nombre:</strong> {extraInfo.nombre}</p>
              <p><strong>Tipo:</strong> {extraInfo.tipo}</p>
              <p><strong>Tamaño:</strong> {extraInfo.tamano}</p>
              <p className="warning-text" style={{ color: "red" }}>
                <strong>Esteganografía:</strong> {extraInfo.esteganografia}
              </p>
            </div>
          )}
        </div>

        <div className="button-grid">
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
            disabled={!file}
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

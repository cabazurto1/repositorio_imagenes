import React, { useState, useEffect } from "react";

const App = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [approvedImages, setApprovedImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);

  // Cargar imágenes al inicio
  useEffect(() => {
    fetchApprovedImages();
    fetchPendingImages();
  }, []);

  // Obtener imágenes aprobadas
  const fetchApprovedImages = async () => {
    try {
      const response = await fetch("http://localhost:4000/images");
      if (!response.ok) throw new Error("Error al obtener imágenes aprobadas.");
      const data = await response.json();
      setApprovedImages(data || []); // Asegúrate de que sea un array
    } catch (error) {
      console.error("Error fetching approved images:", error);
      setApprovedImages([]);
    }
  };

  // Obtener imágenes pendientes
  const fetchPendingImages = async () => {
    try {
      const response = await fetch("http://localhost:4000/images?status=pending");
      if (!response.ok) throw new Error("Error al obtener imágenes pendientes.");
      const data = await response.json();
      setPendingImages(data || []); // Asegúrate de que sea un array
    } catch (error) {
      console.error("Error fetching pending images:", error);
      setPendingImages([]);
    }
  };

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  // Subir imagen
  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:4000/images/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Imagen subida correctamente. Pendiente de aprobación.");
        setFile(null);
        await fetchPendingImages(); // Actualizar imágenes pendientes
      } else {
        setMessage(data.error || "Error al subir la imagen.");
      }
    } catch (error) {
      setMessage("Error al subir la imagen.");
      console.error(error);
    }
  };

  // Aprobar o rechazar imagen
  const updateImageStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:4000/images/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("admin:admin123"), // Credenciales básicas
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setMessage(`Imagen ${status === "approved" ? "aprobada" : "rechazada"} correctamente.`);
        await fetchPendingImages(); // Actualizar lista de pendientes
        await fetchApprovedImages(); // Actualizar lista de aprobadas
      } else {
        const data = await response.json();
        setMessage(data.error || "Error al actualizar la imagen.");
      }
    } catch (error) {
      console.error("Error al actualizar imagen:", error);
      setMessage("Error al actualizar la imagen.");
    }
  };

  return (
    <div className="container">
      {/* Subida de imágenes */}
      <div className="upload-box">
        <h1>
          <i className="fas fa-cloud-upload-alt"></i> Subir Imagen
        </h1>
        <div className="file-input">
          <input type="file" id="file" onChange={handleFileChange} />
          <label htmlFor="file">Seleccionar Archivo</label>
        </div>
        {file && <p className="file-name">{file.name}</p>}
        <button className="upload-button" onClick={handleUpload}>
          <i className="fas fa-upload"></i> Subir
        </button>
        {message && (
          <p className={`message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </p>
        )}
      </div>

      {/* Lista de imágenes aprobadas */}
      <div className="upload-box">
        <h1>Imágenes Aprobadas</h1>
        {approvedImages.length > 0 ? (
          approvedImages.map((image) => {
            const buffer = image.buffer?.data || [];
            const base64String = buffer.length
              ? btoa(
                  new Uint8Array(buffer).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                  )
                )
              : "";

            return (
              <img
                key={image._id}
                src={`data:${image.mimetype};base64,${base64String}`}
                alt={image.originalname}
                style={{ maxWidth: "100%", marginBottom: "1rem" }}
              />
            );
          })
        ) : (
          <p>No hay imágenes aprobadas todavía.</p>
        )}
      </div>

      {/* Lista de imágenes pendientes */}
      <div className="upload-box">
        <h1>Imágenes Pendientes</h1>
        {pendingImages.length > 0 ? (
          pendingImages.map((image) => (
            <div key={image._id} style={{ marginBottom: "1rem" }}>
              <p>{image.originalname}</p>
              <button
                className="upload-button"
                onClick={() => updateImageStatus(image._id, "approved")}
                style={{ marginRight: "0.5rem" }}
              >
                Aprobar
              </button>
              <button
                className="upload-button"
                onClick={() => updateImageStatus(image._id, "rejected")}
                style={{ backgroundColor: "red" }}
              >
                Rechazar
              </button>
            </div>
          ))
        ) : (
          <p>No hay imágenes pendientes de aprobación.</p>
        )}
      </div>
    </div>
  );
};

export default App;

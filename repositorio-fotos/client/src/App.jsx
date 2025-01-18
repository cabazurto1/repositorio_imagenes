import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./App.css";

// Arrow components optimizados con lambda functions
const SampleNextArrow = ({ className, style, onClick }) => (
  <div
    className={`${className} custom-slick-arrow custom-slick-next`}
    style={style}
    onClick={onClick}
  >
    &gt;
  </div>
);

const SamplePrevArrow = ({ className, style, onClick }) => (
  <div
    className={`${className} custom-slick-arrow custom-slick-prev`}
    style={style}
    onClick={onClick}
  >
    &lt;
  </div>
);

const App = () => {
  // Estados
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [approvedImages, setApprovedImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Configuración base para fetch
  const BASE_URL = "http://localhost:4000";
  const headers = {
    Authorization: `Basic ${btoa("admin:admin123")}`,
  };

  // Funciones fetch optimizadas
  const fetchData = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          ...headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      throw error;
    }
  };

  // Fetch de imágenes aprobadas
  const fetchApprovedImages = async () => {
    try {
      setIsLoading(true);
      const data = await fetchData("/images");
      setApprovedImages(data ?? []);
    } catch (error) {
      console.error("Error fetching approved images:", error);
      setApprovedImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch de imágenes pendientes
  const fetchPendingImages = async () => {
    try {
      const data = await fetchData("/images?status=pending");
      setPendingImages(data ?? []);
    } catch (error) {
      console.error("Error fetching pending images:", error);
      setPendingImages([]);
    }
  };

  // Función para subir imagen
  const handleUpload = async () => {
    if (!file?.file) {
      setMessage("Por favor selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file.file);

    try {
      const data = await fetchData("/images/upload", {
        method: "POST",
        body: formData,
        headers: {}, // Override default headers for FormData
      });
      
      setMessage("Imagen subida correctamente. Pendiente de aprobación.");
      setFile(null);
      await fetchPendingImages();
    } catch (error) {
      setMessage("Error al subir la imagen.");
    }
  };

  // Función para actualizar estado de imagen
  const updateImageStatus = async (id, status) => {
    try {
      await fetchData(`/images/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      setMessage(`Imagen ${status === "approved" ? "aprobada" : "rechazada"} correctamente.`);
      await Promise.all([fetchPendingImages(), fetchApprovedImages()]);
    } catch (error) {
      setMessage("Error al actualizar la imagen. Verifica la conexión al servidor.");
    }
  };

  // Manejador de cambio de archivo optimizado
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFile({ file: selectedFile, preview: previewUrl });
      setMessage("");
    }
    e.target.value = null;
  };

  // Effect para cargar datos iniciales
  useEffect(() => {
    Promise.all([fetchApprovedImages(), fetchPendingImages()]);
    
    return () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, []);

  // Configuración del slider optimizada
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "40px",
    autoplay: true,
    autoplaySpeed: 2500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        }
      }
    ]
  };

  // Función helper para convertir buffer a base64
  const bufferToBase64 = (buffer) => {
    if (!buffer?.data) return "";
    return btoa(
      new Uint8Array(buffer.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
  };

  if (isLoading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Repositorio de Fotos</h1>
      </header>

      <section className="carousel-section">
        <h2>Imágenes Aprobadas</h2>
        {approvedImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {approvedImages.map((image) => (
              <div key={image._id} className="carousel-image">
                <img
                  src={`data:${image.mimetype};base64,${bufferToBase64(image.buffer)}`}
                  alt={image.originalname}
                  className="carousel-img"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p className="no-images">No hay imágenes aprobadas todavía.</p>
        )}
      </section>

      <main className="main-content">
        <div className="upload-box">
          <h2>Subir Imagen</h2>
          <div className="upload-actions">
            <label htmlFor="file" className="button same-size-button">
              Seleccionar imagen
              <input
                type="file"
                id="file"
                className="file-input"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>

            <button 
              onClick={handleUpload} 
              className="button same-size-button"
              disabled={!file}
            >
              Subir
            </button>
          </div>

          {file?.preview && (
            <img 
              src={file.preview} 
              alt="Previsualización" 
              className="preview-img" 
            />
          )}

          {message && (
            <p className={`message ${message.includes("Error") ? "error" : "success"}`}>
              {message}
            </p>
          )}
        </div>

        <div className="pending-images">
          <h2>Imágenes Pendientes</h2>
          {pendingImages.length > 0 ? (
            pendingImages.map((image) => (
              <div key={image._id} className="pending-image">
                <p>{image.originalname}</p>
                <button
                  onClick={() => updateImageStatus(image._id, "approved")}
                  className="approve-button"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => updateImageStatus(image._id, "rejected")}
                  className="reject-button"
                >
                  Rechazar
                </button>
              </div>
            ))
          ) : (
            <p>No hay imágenes pendientes de aprobación.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
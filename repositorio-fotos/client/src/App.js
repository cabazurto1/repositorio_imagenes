import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

// Flecha personalizada: Next
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow custom-slick-next`}
      style={{ ...style }}
      onClick={onClick}
    >
      &gt;
    </div>
  );
};

// Flecha personalizada: Prev
const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow custom-slick-prev`}
      style={{ ...style }}
      onClick={onClick}
    >
      &lt;
    </div>
  );
};

const App = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [approvedImages, setApprovedImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);

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
      setApprovedImages(data || []);
    } catch (error) {
      console.error("Error fetching approved images:", error);
      setApprovedImages([]);
    }
  };

  // Obtener imágenes pendientes
  const fetchPendingImages = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/images?status=pending"
      );
      if (!response.ok) throw new Error("Error al obtener imágenes pendientes.");
      const data = await response.json();
      setPendingImages(data || []);
    } catch (error) {
      console.error("Error fetching pending images:", error);
      setPendingImages([]);
    }
  };

  // Manejar la selección de archivo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const previewUrl = URL.createObjectURL(selectedFile);

      setFile({ file: selectedFile, preview: previewUrl });
      setMessage("");
    }

    // Resetea el input para que el usuario pueda volver a seleccionar la misma foto
    e.target.value = null;
  };

  // Subir imagen al servidor
  const handleUpload = async () => {
    if (!file || !file.file) {
      setMessage("Por favor selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file.file);

    try {
      const response = await fetch("http://localhost:4000/images/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Imagen subida correctamente. Pendiente de aprobación.");
        setFile(null);
        await fetchPendingImages();
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
          Authorization: "Basic " + btoa("admin:admin123"),
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setMessage(
          `Imagen ${
            status === "approved" ? "aprobada" : "rechazada"
          } correctamente.`
        );
        await Promise.all([fetchPendingImages(), fetchApprovedImages()]);
      } else {
        const data = await response.json();
        setMessage(data.error || "Error al actualizar la imagen.");
      }
    } catch (error) {
      setMessage(
        "Error al actualizar la imagen. Verifica la conexión al servidor."
      );
      console.error(error);
    }
  };

  // Liberar la URL de previsualización al desmontar
  useEffect(() => {
    return () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  // Configuración del carrusel
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
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Repositorio de Fotos</h1>
      </header>

      <section className="carousel-section">
        <h2>Imágenes Aprobadas</h2>
        {approvedImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {approvedImages.map((image) => {
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
                <div key={image._id} className="carousel-image">
                  <img
                    src={`data:${image.mimetype};base64,${base64String}`}
                    alt={image.originalname}
                    className="carousel-img"
                  />
                </div>
              );
            })}
          </Slider>
        ) : (
          <p className="no-images">No hay imágenes aprobadas todavía.</p>
        )}
      </section>

      <main className="main-content">
        <div className="upload-box">
          <h2>Subir Imagen</h2>

          {/* Contenedor para los dos botones */}
          <div className="upload-actions">
            {/* Botón de seleccionar archivo */}
            <label htmlFor="file" className="button same-size-button">
              Seleccionar imagen
              <input
                type="file"
                id="file"
                className="file-input"
                onChange={handleFileChange}
              />
            </label>

            {/* Botón de subir */}
            <button onClick={handleUpload} className="button same-size-button">
              Subir
            </button>
          </div>

          {/* Vista previa de la imagen */}
          {file && file.preview && (
            <img src={file.preview} alt="Previsualización" className="preview-img" />
          )}

          {/* Mensaje de éxito o error */}
          {message && (
            <p
              className={`message ${
                message.includes("Error") ? "error" : "success"
              }`}
            >
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

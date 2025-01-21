import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "./Carousel"; // Componente del carrusel
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [approvedImages, setApprovedImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(null); // Estado para el mensaje emergente
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedImages();
    fetchPendingImages();
  }, []);

  const fetchApprovedImages = async () => {
    try {
      const response = await axios.get("http://localhost:4000/images?status=approved");
      setApprovedImages(response.data);
    } catch (error) {
      console.error("Error fetching approved images:", error);
    }
  };

  const fetchPendingImages = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:4000/images?status=pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingImages(response.data);
    } catch (err) {
      setError("Error al obtener las imágenes pendientes.");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:4000/images/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingImages(); // Actualizar la lista de imágenes pendientes
    } catch (err) {
      setError("Error al actualizar el estado de la imagen.");
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:4000/images/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApprovedImages(approvedImages.filter((image) => image._id !== id));
      setDeleteDialog(null); // Cerrar el cuadro de diálogo
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      setDeleteDialog(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>📊 Panel de Administración</h2>
        <button className="button button-danger" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>

      <section className="approved-section">
        <h3>Imágenes Aprobadas</h3>
        {approvedImages.length > 0 ? (
          <Carousel
            images={approvedImages}
            onDelete={(id, alias) =>
              setDeleteDialog({
                id,
                alias,
                message: `¿Está seguro de eliminar esta foto subida por "${alias}"?`,
              })
            }
          />
        ) : (
          <p className="no-approved-images">No hay imágenes aprobadas todavía.</p>
        )}
      </section>

      <section className="pending-section">
        <h3>Imágenes Pendientes de Aprobación</h3>
        {error && <p className="error-message">{error}</p>}
        {pendingImages.length > 0 ? (
          <div className="image-gallery">
            {pendingImages.map((image) => (
              <div key={image._id} className="image-card">
                <img
                  src={`data:${image.mimetype};base64,${btoa(
                    new Uint8Array(image.buffer.data).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ""
                    )
                  )}`}
                  alt={image.originalname}
                  className="image-preview"
                />
                <p>
                  <strong>Alias:</strong> {image.alias}
                </p>
                <p>
                  <strong>Nombre:</strong> {image.originalname}
                </p>
                <div className="button-group">
                  <button
                    className="button button-success"
                    onClick={() => handleStatusChange(image._id, "approved")}
                  >
                    Aprobar
                  </button>
                  <button
                    className="button button-danger"
                    onClick={() => handleStatusChange(image._id, "rejected")}
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-pending-images">No hay imágenes pendientes de aprobación.</p>
        )}
      </section>

      {deleteDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{deleteDialog.message}</p>
            <div className="modal-buttons">
              <button
                className="delete-button"
                onClick={() => handleDeleteImage(deleteDialog.id)}
              >
                Confirmar
              </button>
              <button
                className="cancel-button"
                onClick={() => setDeleteDialog(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="dashboard-footer">
        <Link to="/" className="link">
          Volver al Menú Principal
        </Link>
      </footer>
    </div>
  );
};

export default AdminDashboard;

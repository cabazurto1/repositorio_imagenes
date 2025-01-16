import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Importar el CSS general
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingImages();
  }, []);

  const fetchPendingImages = async () => {
    try {
      const response = await axios.get('http://localhost:4000/images/pending');
      setImages(response.data);
    } catch (err) {
      setError('Error al obtener las imágenes pendientes.');
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:4000/images/${id}`, { status });
      if (response.status === 200) {
        fetchPendingImages(); // Actualizar la lista después de aprobar/rechazar
      }
    } catch (err) {
      setError('Error al actualizar el estado de la imagen.');
      console.error(err);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2><i className="fas fa-user-shield"></i> Panel de Administración</h2>
        <button onClick={handleLogout} className="button button-danger">
          Cerrar Sesión
        </button>
      </header>

      {error && <p className="message error">{error}</p>}

      <div className="dashboard-content">
        <h3>Imágenes Pendientes</h3>
        {images.length === 0 ? (
          <p>No hay imágenes pendientes de aprobación.</p>
        ) : (
          <div className="image-gallery">
            {images.map((image) => (
              <div key={image._id} className="image-card">
                <img
                  src={`data:${image.mimetype};base64,${image.buffer}`}
                  alt={image.originalname}
                  className="image-preview"
                />
                <p><strong>Nombre:</strong> {image.originalname}</p>
                <p><strong>Tamaño:</strong> {(image.size / 1024).toFixed(2)} KB</p>
                <div className="button-group">
                  <button
                    onClick={() => handleStatusChange(image._id, 'approved')}
                    className="button button-success"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleStatusChange(image._id, 'rejected')}
                    className="button button-danger"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="dashboard-footer">
        <Link to="/" className="link">
          Volver al Menú Principal
        </Link>
      </footer>
    </div>
  );
};

export default AdminDashboard;

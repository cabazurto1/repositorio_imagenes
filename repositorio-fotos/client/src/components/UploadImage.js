import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Por favor selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      await axios.post('http://localhost:4000/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Imagen subida exitosamente.');
    } catch {
      setMessage('Error al subir la imagen.');
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h2><i className="fas fa-cloud-upload-alt"></i> Subir Imagen</h2>
        <form onSubmit={handleUpload}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit" className="button button-success">Subir</button>
        </form>
        {message && <p className={`message ${message.includes('exitosamente') ? 'success' : 'error'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default UploadImage;

import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [fileName, setFileName] = useState(''); // Nueva variable para almacenar el nombre del archivo

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name); // Guardar el nombre del archivo seleccionado
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMsg('Por favor selecciona un archivo primero.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('http://localhost:4000/images/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Subida exitosa
        setUploadMsg(`Subida exitosa. ID: ${data.imageId}`);
      } else {
        // Error específico del servidor
        if (data.error) {
          setUploadMsg(`Error: ${data.error}`);
        } else {
          setUploadMsg('Ocurrió un error desconocido.');
        }
      }
    } catch (err) {
      console.error(err);
      // Error de conexión
      setUploadMsg('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="container">
      <div className="upload-box">
        <h1>
          <i className="fas fa-cloud-upload-alt"></i> Subir Imagen
        </h1>
        <div className="file-input">
          <input id="file" type="file" onChange={handleFileChange} />
          <label htmlFor="file">
            <i className="fas fa-file-upload"></i> Seleccionar archivo
          </label>
          {fileName && <p className="file-name">Archivo seleccionado: {fileName}</p>}
        </div>
        <button className="upload-button" onClick={handleUpload}>
          <i className="fas fa-upload"></i> Subir
        </button>
        <p
          className={`message ${
            uploadMsg.includes('Error') ? 'error' : 'success'
          }`}
        >
          {uploadMsg}
        </p>
      </div>
    </div>
  );
}

export default App;

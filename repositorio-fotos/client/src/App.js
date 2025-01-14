// App.js
import React, { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Selecciona un archivo primero.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('http://localhost:4000/images/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        setUploadMsg(`Subida exitosa. ID: ${data.imageId}`);
      } else {
        setUploadMsg(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setUploadMsg('Error de conexión');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Subir Imagen</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir</button>
      <p>{uploadMsg}</p>
    </div>
  );
}

export default App;

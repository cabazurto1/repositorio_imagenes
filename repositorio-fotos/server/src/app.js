// app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer'); // Importar Multer para manejar errores
const imageRoutes = require('./routes/imageRoutes');

const { MONGO_URI, PORT, ADMIN_USER, ADMIN_PASS } = process.env;

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000', // Ajustar al origen del frontend
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], // Permitir encabezados necesarios
}));

// Middleware para parsear JSON
app.use(express.json());

// Conexión a la base de datos
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas para imágenes
app.use('/images', imageRoutes);

// Ruta opcional para login de administrador
app.post('/admin/login', (req, res) => {
  const { user, pass } = req.body;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    // Simular un token de sesión (puedes usar JWT en proyectos reales)
    return res.json({ message: 'Login exitoso', token: 'fake-token' });
  } else {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

// Manejo global de errores
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Errores específicos de Multer
    return res.status(400).json({ error: err.message });
  } else if (err) {
    console.error("Error Global:", err.stack);
    return res.status(500).json({ error: "Algo salió mal en el servidor." });
  }
  next();
});

// Levantar servidor
const port = PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});

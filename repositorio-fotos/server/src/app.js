// app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer'); // Importar Multer para manejar errores
const imageRoutes = require('./routes/imageRoutes');

const { MONGO_URI, PORT, ADMIN_USER, ADMIN_PASS } = process.env;

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la BD
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.use('/images', imageRoutes);

// RUTA DE LOGIN ADMIN (opcional)
app.post('/admin/login', (req, res) => {
  const { user, pass } = req.body;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    // Generar un token de sesión si quieres
    return res.json({ message: 'Login exitoso', token: 'fake-token' });
  } else {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

// Manejar errores globales
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
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

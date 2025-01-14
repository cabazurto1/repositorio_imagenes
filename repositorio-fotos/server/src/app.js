require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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
// Si quieres un login básico para el admin, algo así:
app.post('/admin/login', (req, res) => {
  const { user, pass } = req.body;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    // Generar un token de sesión si quieres
    return res.json({ message: 'Login exitoso', token: 'fake-token' });
  } else {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

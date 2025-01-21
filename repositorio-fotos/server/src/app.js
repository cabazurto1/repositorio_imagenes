require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const imageRoutes = require('./routes/imageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const Admin = require('./models/Admin'); // Importar el modelo de administrador

const { MONGO_URI, PORT, ADMIN_USER, ADMIN_PASS, SECRET_KEY } = process.env;

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON
app.use(express.json());

// Conexión a la base de datos
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Inicializar el administrador
async function initializeAdmin() {
  const adminExists = await Admin.findOne({ username: ADMIN_USER });
  if (!adminExists) {
    await Admin.create({ username: ADMIN_USER, password: ADMIN_PASS });
    console.log('Administrador creado con éxito.');
  } else {
    console.log('Administrador ya existe.');
  }
}

mongoose.connection.once('open', () => {
  initializeAdmin().catch(err => console.error('Error inicializando administrador:', err));
});

// Rutas para imágenes
app.use('/images', imageRoutes);

// Rutas para administración
app.use('/admin', adminRoutes);

// Manejo global de errores
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    console.error('Error Global:', err.stack);
    return res.status(500).json({ error: 'Algo salió mal en el servidor.' });
  }
  next();
});

// Levantar servidor
const port = PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});

const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'mysecretkey';

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
  const { user, pass } = req.body;

  try {
    const admin = await Admin.findOne({ username: user, password: pass });
    if (!admin) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar el token JWT
    const token = jwt.sign({ id: admin._id, username: admin.username }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;

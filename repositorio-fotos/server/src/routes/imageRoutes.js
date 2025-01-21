// routes/imageRoutes.js

const express = require("express");
const router = express.Router();
const upload = require("../middlewares/fileUpload"); // Middleware de Multer
const imageController = require("../controllers/imageController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Ruta para subir una imagen - ya no requiere autenticación
router.post("/upload", upload.single("image"), imageController.uploadImage);

// Ruta para obtener todas las imágenes aprobadas
router.get("/", imageController.getAllImages);

// Ruta para aprobar o rechazar una imagen - NO utiliza Multer
router.put("/:id", authenticateToken, imageController.updateImageStatus);

// Ruta para eliminar una imagen - NO utiliza Multer
router.delete("/:id", authenticateToken, imageController.deleteImage);

// Ruta para obtener imágenes pendientes (solo accesible para administradores)
router.get("/pending", authenticateToken, imageController.getPendingImages);

module.exports = router;

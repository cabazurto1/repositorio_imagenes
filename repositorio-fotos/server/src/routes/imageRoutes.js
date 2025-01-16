// routes/imageRoutes.js

const express = require("express");
const router = express.Router();
const upload = require("../middlewares/fileUpload"); // Middleware de Multer
const imageController = require("../controllers/imageController");
const { authenticateAdmin } = require("../middlewares/authMiddleware");

// Ruta para subir una imagen - utiliza Multer
router.post("/upload", upload.single("image"), imageController.uploadImage);

// Ruta para obtener todas las imágenes aprobadas
router.get("/", imageController.getAllImages);

// Ruta para aprobar o rechazar una imagen - NO utiliza Multer
router.put("/:id", authenticateAdmin, imageController.updateImageStatus);

// Ruta para eliminar una imagen - NO utiliza Multer
router.delete("/:id", authenticateAdmin, imageController.deleteImage);

module.exports = router;

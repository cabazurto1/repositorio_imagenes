// controllers/imageController.js

const Image = require("../models/Image");
const fs = require("fs");
const path = require("path");

// Subir imagen (solo guarda metadata y buffer en la base de datos)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha proporcionado ninguna imagen." });
    }
    // Log para verificar el archivo recibido
    console.log("Archivo recibido:", req.file);

    const newImage = await Image.create({
      originalname: req.file.originalname, // Campo obligatorio
      filename: req.file.originalname,     // Si deseas mantener ambos
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer,             // Almacena el buffer en la base de datos
      status: "pending", // Estado inicial
    });

    return res.status(201).json({
      message: "Imagen subida correctamente. Pendiente de aprobación.",
      imageId: newImage._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ocurrió un error subiendo la imagen." });
  }
};

// Obtener todas las imágenes aprobadas
// Obtener todas las imágenes (opcionalmente filtradas por estado)
exports.getAllImages = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {}; // Filtrar por estado si se proporciona
    const images = await Image.find(filter);
    return res.json(images);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al obtener imágenes." });
  }
};

// Aprobar o rechazar imagen
exports.updateImageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Log para depurar
    console.log(`Aprobando imagen con ID: ${id}, Status: ${status}`);

    // Verificar si el estado es válido
    if (!["approved", "rejected"].includes(status)) {
      console.log("Estado inválido proporcionado.");
      return res.status(400).json({ error: "Estado inválido." });
    }

    // Buscar la imagen por ID
    const image = await Image.findById(id);
    if (!image) {
      console.log("Imagen no encontrada en la base de datos.");
      return res.status(404).json({ error: "Imagen no encontrada." });
    }

    // Verificar si el buffer existe para aprobar
    if (status === "approved") {
      if (!image.buffer) {
        console.log("Buffer de la imagen no encontrado en la base de datos.");
        return res.status(500).json({ error: "Buffer de la imagen no encontrado." });
      }
    }

    if (status === "rejected") {
      // Eliminar metadata de la base de datos
      await Image.findByIdAndDelete(id);
      console.log("Imagen rechazada y eliminada correctamente.");
      return res.json({ message: "Imagen rechazada y eliminada correctamente." });
    }

    if (status === "approved") {
      // Guardar físicamente la imagen en /uploads
      const uploadPath = path.join(__dirname, "..", "uploads", image.filename);

      // Usar el buffer almacenado en la base de datos
      fs.writeFileSync(uploadPath, image.buffer);
      console.log(`Imagen guardada en ${uploadPath}`);

      // Actualizar el estado a aprobado
      image.status = status;
      image.filename = path.basename(uploadPath); // Guarda el nombre definitivo del archivo
      await image.save();
      console.log("Estado de la imagen actualizado a aprobado.");

      return res.json({
        message: "Imagen aprobada y guardada correctamente.",
        image,
      });
    }
  } catch (err) {
    console.error("Error al actualizar la imagen:", err);
    return res.status(500).json({ error: "Error al actualizar la imagen." });
  }
};

// Eliminar una imagen
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findByIdAndDelete(id);

    if (!image) {
      return res.status(404).json({ error: "Imagen no encontrada." });
    }

    // Eliminar el archivo físicamente si existe
    const imagePath = path.join(__dirname, "..", "uploads", image.filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`Archivo ${image.filename} eliminado.`);
    }

    return res.json({ message: "Imagen eliminada correctamente." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al eliminar la imagen." });
  }
};

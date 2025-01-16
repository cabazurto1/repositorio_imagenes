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
    console.log("Archivo recibido:", req.file);

    // Crea la imagen en la base de datos
    const newImage = await Image.create({
      originalname: req.file.originalname, // nombre original
      filename: req.file.originalname,     // lo podemos sobreescribir luego
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer,            
      status: "pending",                  // estado inicial
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

// Obtener todas las imágenes
exports.getAllImages = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
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

    console.log(`Actualizando imagen con ID: ${id}, nuevo status: ${status}`);

    // Validar el status
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Estado inválido. Debe ser 'approved' o 'rejected'." });
    }

    // Buscar la imagen por ID
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ error: "Imagen no encontrada." });
    }

    // Si se rechaza, se elimina la metadata y no se guarda en disco
    if (status === "rejected") {
      await Image.findByIdAndDelete(id);
      console.log(`Imagen ${id} rechazada y eliminada de la BD.`);
      return res.json({ message: "Imagen rechazada y eliminada correctamente." });
    }

    // Si se aprueba, se valida que exista el buffer
    if (!image.buffer) {
      return res.status(500).json({ error: "Buffer de la imagen no encontrado." });
    }

    // Guardar físicamente la imagen en /uploads con nombre basado en el _id
    const originalExt = path.extname(image.filename); // extraer la extensión (.jpg, .png, etc.)
    const newFilename = `${image._id}${originalExt}`; // usar el _id como nombre
    const uploadPath = path.join(__dirname, "..", "uploads", newFilename);

    fs.writeFileSync(uploadPath, image.buffer);
    console.log(`Imagen guardada en ${uploadPath}`);

    // Actualizar el estado a 'approved' y la metadata de filename
    image.status = "approved";
    image.filename = newFilename; // guardamos el nuevo nombre en la BD
    await image.save();

    console.log("Estado de la imagen actualizado a 'approved'.");
    return res.json({
      message: "Imagen aprobada y guardada correctamente.",
      image,
    });
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
      console.log(`Archivo ${image.filename} eliminado físicamente.`);
    }

    return res.json({ message: "Imagen eliminada correctamente." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al eliminar la imagen." });
  }
};

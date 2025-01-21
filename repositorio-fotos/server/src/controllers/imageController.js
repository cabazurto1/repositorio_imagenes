const Image = require("../models/Image");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { exiftool } = require("exiftool-vendored");

exports.uploadImage = async (req, res) => {
  try {
    console.log("Iniciando proceso de subida de imagen");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { alias } = req.body;

    // Validación básica
    if (!req.file) {
      return res.status(400).json({ 
        error: "No se ha proporcionado ninguna imagen.",
        details: "El archivo es requerido"
      });
    }

    if (!alias || alias.trim() === "") {
      return res.status(400).json({ 
        error: "El alias es obligatorio.",
        details: "Se requiere un alias para la imagen"
      });
    }

    // Validación básica del archivo
    const validationResult = await validateImage(req.file);
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: "La imagen no cumple con los requisitos.",
        details: validationResult.errors
      });
    }

    // Crear la imagen en la base de datos
    const newImage = await Image.create({
      originalname: req.file.originalname,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer,
      alias,
      status: "pending",
      securityAnalysis: validationResult
    });

    return res.status(201).json({
      message: "Imagen subida correctamente.",
      imageId: newImage._id,
      security: {
        status: "passed",
        fileSize: req.file.size,
        format: validationResult.format
      }
    });

  } catch (err) {
    console.error("Error en uploadImage:", err);
    return res.status(500).json({ 
      error: "Error al procesar la imagen.",
      details: err.message 
    });
  }
};

async function validateImage(file) {
  const result = {
    isValid: true,
    errors: [],
    format: null
  };

  try {
    // Validar que existe el archivo
    if (!file || !file.buffer) {
      result.isValid = false;
      result.errors.push("Archivo no válido o corrupto");
      return result;
    }

    // Validar tamaño
    if (file.size > 10 * 1024 * 1024) { // 10MB
      result.isValid = false;
      result.errors.push("El archivo excede el tamaño máximo permitido (10MB)");
      return result;
    }

    // Validar tipo de archivo usando sharp
    const imageInfo = await sharp(file.buffer).metadata();
    result.format = imageInfo.format;

    // Validar formato permitido
    const allowedFormats = ['jpeg', 'jpg', 'png', 'gif'];
    if (!allowedFormats.includes(imageInfo.format?.toLowerCase())) {
      result.isValid = false;
      result.errors.push("Formato de imagen no permitido");
      return result;
    }

    // Análisis básico de seguridad
    try {
      const metadata = await exiftool.read(file.buffer);
      if (metadata.Error) {
        result.isValid = false;
        result.errors.push("Error en metadatos de la imagen");
      }
    } catch (exifError) {
      console.warn("Error al leer metadatos:", exifError);
      // No bloqueamos la subida por errores en metadatos
    }

  } catch (err) {
    result.isValid = false;
    result.errors.push("Error al procesar la imagen: " + err.message);
  }

  return result;
}

exports.getPendingImages = async (req, res) => {
  try {
    const images = await Image.find({ status: "pending" });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener imágenes pendientes." });
  }
};

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

exports.updateImageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Estado inválido." });
    }

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ error: "Imagen no encontrada." });
    }

    if (status === "rejected") {
      await Image.findByIdAndDelete(id);
      return res.json({ message: "Imagen rechazada y eliminada." });
    }

    if (!image.buffer) {
      return res.status(500).json({ error: "Buffer de imagen no encontrado." });
    }

    const uploadPath = path.join(__dirname, "..", "uploads", `${image._id}${path.extname(image.filename)}`);
    fs.writeFileSync(uploadPath, image.buffer);

    image.status = "approved";
    image.filename = path.basename(uploadPath);
    await image.save();

    return res.json({
      message: "Imagen aprobada y guardada.",
      image
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al actualizar la imagen." });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findByIdAndDelete(id);

    if (!image) {
      return res.status(404).json({ error: "Imagen no encontrada." });
    }

    const imagePath = path.join(__dirname, "..", "uploads", image.filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    return res.json({ message: "Imagen eliminada correctamente." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al eliminar la imagen." });
  }
};
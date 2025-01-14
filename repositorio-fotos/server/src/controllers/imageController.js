const Image = require('../models/Image');

// Subir imagen (solo usuario común, sin autenticación en este ejemplo)
exports.uploadImage = async (req, res) => {
  try {
    // multer guarda el archivo en req.file
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen.' });
    }

    // Guardar metadata en la BD
    const newImage = await Image.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    return res.status(201).json({
      message: 'Imagen subida correctamente. Pendiente de aprobación.',
      imageId: newImage._id
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ocurrió un error subiendo la imagen.' });
  }
};

// Obtener lista de imágenes (para el admin)
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    return res.json(images);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener imágenes.' });
  }
};

// Aprobar o rechazar una imagen
exports.updateImageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" o "rejected"
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido.' });
    }

    const updated = await Image.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ error: 'Imagen no encontrada.' });
    }

    return res.json({
      message: `Imagen ${status} exitosamente.`,
      image: updated
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al actualizar imagen.' });
  }
};

// Borrar una imagen (opcional, por ejemplo si está rechazada)
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Image.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Imagen no encontrada.' });
    }

    // Opcional: Borrar el archivo físico del servidor
    // fs.unlinkSync(path.join(__dirname, '..', 'uploads', deleted.filename));

    return res.json({ message: 'Imagen eliminada correctamente.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al eliminar la imagen.' });
  }
};

// middlewares/fileUpload.js

const multer = require("multer");
const path = require("path");
const { MAX_FILE_SIZE, ALLOWED_EXTENSIONS } = process.env;

// Configuración de almacenamiento temporal en memoria
const storage = multer.memoryStorage(); // Almacena los archivos temporalmente en memoria

// Filtro para validar tipo de archivo y extensión
function fileFilter(req, file, cb) {
  const allowedExts = (ALLOWED_EXTENSIONS || ".jpg,.jpeg,.png,.gif")
    .split(",")
    .map((e) => e.trim().toLowerCase());

  const fileExt = path.extname(file.originalname).toLowerCase();

  // Validar la extensión
  if (!allowedExts.includes(fileExt)) {
    return cb(new Error("Extensión de archivo no permitida."), false);
  }

  // Validar MIME
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Formato de archivo no permitido."), false);
  }

  cb(null, true);
}

// Configuración de multer
const upload = multer({
  storage,
  fileFilter, // Usa el filtro definido anteriormente
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;

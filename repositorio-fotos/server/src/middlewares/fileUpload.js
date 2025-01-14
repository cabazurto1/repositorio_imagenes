const multer = require('multer');
const path = require('path');
const { MAX_FILE_SIZE, ALLOWED_EXTENSIONS } = process.env;

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    // Generamos un nombre de archivo único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtro para validar tipo de archivo e extensión
function fileFilter (req, file, cb) {
  const allowedExts = (ALLOWED_EXTENSIONS || '.jpg,.jpeg,.png,.gif')
                        .split(',')
                        .map(e => e.trim().toLowerCase());

  const fileExt = path.extname(file.originalname).toLowerCase();

  // Revisar extensión
  if (!allowedExts.includes(fileExt)) {
    return cb(new Error('Extensión de archivo no permitida.'), false);
  }

  // Revisar MIME
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Formato de archivo no permitido.'), false);
  }
  
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(MAX_FILE_SIZE) || 5 * 1024 * 1024  // 5MB por defecto
  }
});

module.exports = upload;

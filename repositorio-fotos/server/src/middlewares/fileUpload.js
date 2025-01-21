const multer = require('multer');
const path = require('path');
const { MAX_FILE_SIZE, ALLOWED_EXTENSIONS } = process.env;

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowedExts = (ALLOWED_EXTENSIONS || '.jpg,.jpeg,.png,.gif')
    .split(',')
    .map(ext => ext.trim().toLowerCase());

  const fileExt = path.extname(file.originalname).toLowerCase();

  if (!allowedExts.includes(fileExt)) {
    return cb(new Error('Extensión de archivo no permitida.'), false);
  }

  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Formato de archivo no permitido.'), false);
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: Number(MAX_FILE_SIZE) },
});

module.exports = upload;

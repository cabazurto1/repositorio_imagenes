const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUpload');
const imageController = require('../controllers/imageController');

// Rutas de imágenes
router.post('/upload', upload.single('image'), imageController.uploadImage);
router.get('/', imageController.getAllImages);
router.put('/:id', imageController.updateImageStatus);
router.delete('/:id', imageController.deleteImage);

module.exports = router;

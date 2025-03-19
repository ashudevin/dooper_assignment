const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { upload, compressImage } = require('../middleware/uploadMiddleware');

// POST /api/upload - Upload an image
router.post('/upload', upload.single('image'), compressImage, imageController.uploadImage);

// GET /api/images/:id - Get image by ID
router.get('/images/:id', imageController.getImageById);

// DELETE /api/images/:id - Delete image by ID
router.delete('/images/:id', imageController.deleteImage);

module.exports = router; 
const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');

// Upload image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create new image document
    const image = new Image({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      path: req.file.path,
      size: req.file.size
    });

    // Save to database
    await image.save();

    // Return image info with URL
    return res.status(201).json({
      success: true,
      image: {
        id: image._id,
        filename: image.filename,
        originalname: image.originalname,
        url: `/uploads/${image.filename}`,
        uploadDate: image.uploadDate
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: 'Server error while uploading image' });
  }
};

// Get image by ID
exports.getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    return res.status(200).json({
      success: true,
      image: {
        id: image._id,
        filename: image.filename,
        originalname: image.originalname,
        url: `/uploads/${image.filename}`,
        uploadDate: image.uploadDate,
        size: image.size
      }
    });
  } catch (error) {
    console.error('Error getting image:', error);
    return res.status(500).json({ error: 'Server error while getting image' });
  }
};

// Delete image by ID
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../public/uploads', image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await Image.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ error: 'Server error while deleting image' });
  }
}; 
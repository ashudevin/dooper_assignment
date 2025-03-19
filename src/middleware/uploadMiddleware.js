const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png) are allowed!'));
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: fileFilter
});

// Middleware for image compression
const compressImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const inputPath = req.file.path;
  const outputPath = path.join(
    path.dirname(inputPath),
    `compressed-${path.basename(inputPath)}`
  );

  try {
    // Ensure the directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Compress image
    await sharp(inputPath)
      .resize(800) // Resize to max width 800px
      .jpeg({ quality: 80 }) // Compress with 80% quality
      .toFile(outputPath);

    // Attempt to delete the original file
    try {
      if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }
    } catch (err) {
      console.error('Error deleting original file:', err);
      // Log the error but continue processing
      // The original file will remain, but the compressed version will still be available
    }

    // Update file information
    req.file.path = outputPath;
    req.file.filename = path.basename(outputPath);
    req.file.size = fs.statSync(outputPath).size;
    
    next();
  } catch (error) {
    console.error('Error compressing image:', error);
    // If compression fails, continue with the original file
    next();
  }
};

module.exports = { upload, compressImage }; 
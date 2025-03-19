const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads'));
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
    // Compress image
    await sharp(inputPath)
      .resize(800) // Resize to max width 800px
      .jpeg({ quality: 80 }) // Compress with 80% quality
      .toFile(outputPath);

    // Delete original file
    fs.unlinkSync(inputPath);

    // Update file information
    req.file.path = outputPath;
    req.file.filename = path.basename(outputPath);
    req.file.size = fs.statSync(outputPath).size;
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, compressImage }; 
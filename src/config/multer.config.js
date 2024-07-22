const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.')
    );
  }
};

// Multer configuration with file size limit and file type filter
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter,
}).array('attachments', 2);

// Middleware to handle errors
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res
            .status(400)
            .json({ error: 'File size should not exceed 5 MB.' });
        }
        return res.status(400).json({ error: `Multer error: ${err.message}` });
      }

      // An unknown error occurred when uploading.
      return res.status(400).json({ error: err.message });
    }

    // Everything went fine.
    next();
  });
};

module.exports = uploadMiddleware;

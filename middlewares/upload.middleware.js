// ============================================================
// middlewares/upload.middleware.js
// Configures Multer for handling resume file uploads
// Multer is a middleware for handling multipart/form-data
// ============================================================

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// STORAGE CONFIGURATION
// Tells Multer WHERE to save files and WHAT to name them
// ============================================================
const storage = multer.diskStorage({
  // Destination folder for uploaded files
  destination: (req, file, cb) => {
    // cb(error, destination)
    cb(null, path.join(__dirname, '..', 'uploads', 'resumes'));
  },

  // File naming strategy: timestamp + original name
  // This prevents naming conflicts when two people upload same filename
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); // e.g., ".pdf"
    const baseName = path.basename(file.originalname, extension)
      .replace(/\s+/g, '_')  // Replace spaces with underscores
      .toLowerCase();

    cb(null, `resume_${baseName}_${uniqueSuffix}${extension}`);
  }
});

// ============================================================
// FILE FILTER
// Only allow PDF files for resumes
// ============================================================
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];
  const allowedExtensions = ['.pdf'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);  // Accept the file
  } else {
    cb(new Error('Only PDF files are allowed for resume upload!'), false);
  }
};

// ============================================================
// MULTER INSTANCE
// Combine storage + fileFilter + size limit
// ============================================================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5 MB maximum file size
  }
});

// ============================================================
// uploadResume middleware
// Handles single file upload with field name "resume"
// Wraps in try-catch to handle Multer errors gracefully
// ============================================================
const uploadResume = (req, res, next) => {
  const uploadSingle = upload.single('resume');

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors (file too large, etc.)
      if (err.code === 'LIMIT_FILE_SIZE') {
        req.uploadError = 'Resume file size must be under 5MB';
      } else {
        req.uploadError = `Upload error: ${err.message}`;
      }
    } else if (err) {
      // Other errors (wrong file type, etc.)
      req.uploadError = err.message;
    }
    // Continue to the controller regardless
    next();
  });
};

export { uploadResume };


import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
 
  destination: (req, file, cb) => {
   
    cb(null, path.join(__dirname, '..', 'uploads', 'resumes'));
  },


  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); // e.g., ".pdf"
    const baseName = path.basename(file.originalname, extension)
      .replace(/\s+/g, '_')  
      .toLowerCase();

    cb(null, `resume_${baseName}_${uniqueSuffix}${extension}`);
  }
});



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



const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  
  }
});



const uploadResume = (req, res, next) => {
  const uploadSingle = upload.single('resume');

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
   
      if (err.code === 'LIMIT_FILE_SIZE') {
        req.uploadError = 'Resume file size must be under 5MB';
      } else {
        req.uploadError = `Upload error: ${err.message}`;
      }
    } else if (err) {
 
      req.uploadError = err.message;
    }

    next();
  });
};

export { uploadResume };

import multer from 'multer';
import {cloudinary} from '../utils/cloudinary.js'
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const allowedFormats = ['jpg', 'png', 'jpeg', 'webp', 'pdf'];

export const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const isPDF = file.mimetype === 'application/pdf';
        const folder = isPDF ? 'pdfs' : 'images';
        const resourceType = isPDF ? 'raw' : 'image';
        const originalName = file.originalname.split('.')[0].replace(/\s+/g, "_");
    
        return {
            folder: `waquar/${folder}`,
            resource_type: resourceType,
            allowed_formats: allowedFormats,
            public_id: `${Date.now()}-${originalName}`,
        };
    },
});


const upload = multer({
    storage,
     fileFilter: (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    if (allowedFormats.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG, PDF, and DOCX files are allowed"), false);
    }
  },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

export default upload;

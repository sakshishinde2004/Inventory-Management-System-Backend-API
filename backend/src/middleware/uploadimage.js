import {CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js';
import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'images'
  },
});
 
const upload = multer({ storage: storage });  

export default upload;   
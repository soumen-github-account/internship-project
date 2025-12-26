// middleware/multer.js
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) =>{
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  if(allowedTypes.includes(file.mimetype)){
    cb(null, true);
  } else{
    cb(new Error("Only PDF, JPG, PNG files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 5mb
  fileFilter
});

export default upload;

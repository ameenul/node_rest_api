const multer = require('multer');
const path = require('path');

// simpan file di folder uploads/ dengan nama unik
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // pastikan folder ini ada
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, name + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // hanya izinkan jpeg/png
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only images allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = upload;

const express = require('express');
const upload = require('../config/multer');
const {
  addCatatan,
  getCatatanUser,
  deleteCatatan
} = require('../controllers/catatanController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.use(verifyToken);

// upload.single('img') akan mengambil field form-data bernama “img”
router.post('/', upload.single('img'), addCatatan);
router.get('/', getCatatanUser);
router.delete('/:id', deleteCatatan);

module.exports = router;

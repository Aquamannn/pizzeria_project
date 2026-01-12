// backend/src/routes/menuRoute.js
const express = require('express');
const router = express.Router();
const { getAllMenus, createMenu, updateMenu, deleteMenu } = require('../controllers/menuController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// --- KONFIGURASI UPLOAD GAMBAR ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Simpan di folder uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
    }
});
const upload = multer({ storage: storage });
// ---------------------------------

// Routes
router.get('/', getAllMenus);

// Tambah Menu (Pake upload.single('image'))
router.post('/', verifyToken, verifyAdmin, upload.single('image'), createMenu);

// Update Menu (:id)
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), updateMenu);

// Hapus Menu (:id)
router.delete('/:id', verifyToken, verifyAdmin, deleteMenu);

module.exports = router;
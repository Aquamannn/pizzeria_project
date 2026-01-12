// backend/src/routes/userRoute.js
const express = require('express');
const router = express.Router();
const { getMyProfile, updateProfile, deleteAccount } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Konfigurasi Multer (Sama kayak Menu)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'user-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Routes
router.get('/me', verifyToken, getMyProfile); // Ambil data diri
router.put('/me', verifyToken, upload.single('image'), updateProfile); // Update
router.delete('/me', verifyToken, deleteAccount); // Hapus

module.exports = router;
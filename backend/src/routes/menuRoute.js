const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllMenus, createMenu, updateMenu, deleteMenu } = require('../controllers/menuController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// --- ROUTES BIASA (TANPA KOMENTAR SWAGGER YANG BIKIN PUSING) ---

router.get('/', getAllMenus);
router.post('/', verifyToken, verifyAdmin, upload.single('image'), createMenu);
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), updateMenu);
router.delete('/:id', verifyToken, verifyAdmin, deleteMenu);

module.exports = router;
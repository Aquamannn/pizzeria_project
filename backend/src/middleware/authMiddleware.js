// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// 1. Cek apakah dia punya Token (Login gak?)
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']; // Ambil token dari header

    if (!token) {
        return res.status(403).json({ message: "Akses Ditolak! Butuh Token." });
    }

    try {
        // Bongkar tokennya (Verify)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Simpan data user (id & role) ke request
        next(); // Lanjut ke controller
    } catch (err) {
        return res.status(401).json({ message: "Token Tidak Valid!" });
    }
};

// 2. Cek apakah dia Admin
exports.verifyAdmin = (req, res, next) => {
    // req.user didapat dari verifyToken di atas
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Khusus Admin woy!" });
    }
    next();
};
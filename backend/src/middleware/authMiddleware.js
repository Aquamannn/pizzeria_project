const jwt = require('jsonwebtoken');

// 1. Cek Token
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; 
    
    // PERBAIKAN DI SINI:
    // Kita pisahkan string berdasarkan spasi: "Bearer" (index 0) dan "eyJ..." (index 1)
    // Jika authHeader ada, kita ambil index ke-1.
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ message: "Akses Ditolak! Token tidak ditemukan." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token Tidak Valid!" });
    }
};

// 2. Cek Admin (Ini sudah benar, tidak perlu diubah)
exports.verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Khusus Admin woy!" });
    }
    next();
};
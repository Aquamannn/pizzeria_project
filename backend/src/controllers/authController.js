// backend/src/controllers/authController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER (DAFTAR)
// backend/src/controllers/authController.js

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // ... (Cek user existing & hash password tetep sama) ...
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- UPDATE BAGIAN INI: PAKE GAMBAR LOKAL ---
        // Pastikan nama file sesuai dengan yang kamu masukin di folder assets tadi
        const defaultAvatars = [
            'http://localhost:5000/assets/avatar1.jpg', 
            'http://localhost:5000/assets/avatar2.jpg',
            'http://localhost:5000/assets/avatar3.jpg',
            'http://localhost:5000/assets/avatar4.jpg'
        ];
        
        // Kocok dadu, pilih 1 dari 4
        const randomImage = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
        // ---------------------------------------------

        const newUser = await User.create({
            name, 
            email, 
            password: hashedPassword,
            role: role || 'customer',
            image: randomImage // Masuk ke database
        });

        res.status(201).json({ message: "Register Berhasil", data: newUser });
    } catch (error) {
        console.error("Error Register:", error);
        res.status(500).json({ message: "Gagal registrasi user" });
    }
};
// 2. LOGIN (MASUK) - UPDATE DI SINI
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "Email tidak ditemukan" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Password salah" });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.json({ 
            message: "Login Berhasil", 
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                image: user.image // <--- INI WAJIB ADA BIAR FOTO KEBAWA
            }
        });

    } catch (error) {
        console.error("Error Login:", error);
        res.status(500).json({ message: error.message });
    }
};
// backend/src/controllers/userController.js
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// 1. AMBIL PROFILE SAYA
exports.getMyProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } // Jangan kirim password
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Gagal ambil profil" });
    }
};

// 2. UPDATE PROFILE (Ganti Nama/Password/Foto)
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        const { name, password } = req.body;

        // Update Text Data
        if (name) user.name = name;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Update Gambar (Jika ada upload)
        if (req.file) {
            user.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        await user.save();

        res.json({ message: "Profil berhasil diupdate", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal update profil" });
    }
};

// 3. HAPUS AKUN
exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        await user.destroy();
        res.json({ message: "Akun berhasil dihapus permanen. Dadah! 👋" });
    } catch (error) {
        res.status(500).json({ message: "Gagal hapus akun" });
    }
};
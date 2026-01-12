// backend/src/controllers/menuController.js
const Menu = require('../models/menu');
const fs = require('fs');
const path = require('path');

// 1. AMBIL SEMUA
exports.getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.findAll();
        res.json(menus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. TAMBAH MENU (Pake Gambar)
exports.createMenu = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        // Cek ada gambar diupload gak?
        const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

        const newMenu = await Menu.create({
            name, description, price, category, image
        });

        res.status(201).json({ message: "Berhasil tambah menu", data: newMenu });
    } catch (error) {
        res.status(500).json({ message: "Gagal tambah menu" });
    }
};

// 3. UPDATE MENU
exports.updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category } = req.body;
        const menu = await Menu.findByPk(id);

        if (!menu) return res.status(404).json({ message: "Menu tidak ditemukan" });

        // Kalau ada gambar baru, update path gambarnya
        let image = menu.image;
        if (req.file) {
            image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        await menu.update({ name, description, price, category, image });

        res.json({ message: "Menu berhasil diupdate", data: menu });
    } catch (error) {
        res.status(500).json({ message: "Gagal update menu" });
    }
};

// 4. HAPUS MENU
exports.deleteMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await Menu.findByPk(id);

        if (!menu) return res.status(404).json({ message: "Menu tidak ditemukan" });

        await menu.destroy();
        res.json({ message: "Menu berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal hapus menu" });
    }
};
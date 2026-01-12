// backend/src/controllers/orderController.js
const Order = require('../models/order');
const User = require('../models/user'); // <--- PASTIKAN USER DI-IMPORT

exports.createOrder = async (req, res) => {
    try {
        const { items, total_price, userId } = req.body;
        const newOrder = await Order.create({
            userId,
            items, 
            total_price,
            status: 'completed'
        });
        res.status(201).json({ message: "Pesanan Berhasil!", data: newOrder });
    } catch (error) {
        console.error("Error Create Order:", error); // Cek terminal kalau error
        res.status(500).json({ message: "Gagal membuat pesanan" });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        // KITA AMBIL ORDER + NAMA USERNYA
        const orders = await Order.findAll({
            include: [{ 
                model: User, 
                attributes: ['name', 'email'] // Cuma ambil nama & email
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error("Error Get History:", error);
        res.status(500).json({ message: "Gagal mengambil data riwayat" });
    }
};
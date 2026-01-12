// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/database');
const path = require('path'); // <--- 1. JANGAN LUPA INI

// Import Routes
const authRoutes = require('./src/routes/authRoute');
const menuRoutes = require('./src/routes/menuRoute');
const userRoutes = require('./src/routes/userRoute');
const orderRoutes = require('./src/routes/orderRoute'); // <--- 2. ROUTE ORDER

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- 3. INI PENTING BIAR GAMBAR MUNCUL ---
// Kita suruh server buka folder 'uploads' biar bisa diakses browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// ------------------------------------------

// Pasang Routes
app.use('/api/users', userRoutes);
app.use('/api', authRoutes); 
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes); // <--- 4. PASANG KABEL ORDER

const startServer = async () => {
    try {
        await db.authenticate();
        console.log('✅ Konek Database OK.');
        
        // --- 5. AKTIFKAN BARIS INI SEKALI AJA BUAT BIKIN TABEL ORDERS ---
        // Hapus tanda komentar (//) di bawah, save, restart server, terus kasih komentar lagi
        await db.sync({ alter: true }); 
        // ---------------------------------------------------------------

        app.listen(PORT, () => {
            console.log(`🚀 Server jalan di port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

startServer();
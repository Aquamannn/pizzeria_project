// backend/src/models/user.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM('admin', 'customer'),
        defaultValue: 'customer'
    },
    // --- TAMBAHAN PENTING (SI PENYELAMAT) ---
    image: {
        type: DataTypes.STRING,
        allowNull: true // Boleh kosong kalau belum punya foto
    }
    // ----------------------------------------
}, {
    freezeTableName: true, 
    timestamps: true,
    createdAt: 'created_at', 
    updatedAt: false 
});

module.exports = User;
// backend/src/models/order.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require('./user'); // Kita hubungkan dengan User

const Order = db.define('orders', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    items: {
        type: DataTypes.JSON, // Simpan data menu yang dibeli sebagai JSON string
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed'),
        defaultValue: 'completed'
    }
}, {
    freezeTableName: true,
    timestamps: true 
});

// Relasi: Order milik User
Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

module.exports = Order;
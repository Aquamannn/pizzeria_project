// backend/src/models/menu.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Menu = db.define('menus', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 0)
    },
    category: {
        type: DataTypes.ENUM('food', 'drink', 'snack')
    },
    image: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Menu;

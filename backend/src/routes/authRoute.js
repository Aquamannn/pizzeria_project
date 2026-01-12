// backend/src/routes/authRoute.js
const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Alamat URL-nya nanti jadi:
// POST http://localhost:5000/api/register
// POST http://localhost:5000/api/login

router.post('/register', register);
router.post('/login', login);

module.exports = router;
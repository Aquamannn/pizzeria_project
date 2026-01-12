// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./src/config/database');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import Routes
const authRoutes = require('./src/routes/authRoute');
const menuRoutes = require('./src/routes/menuRoute');
const userRoutes = require('./src/routes/userRoute');
const orderRoutes = require('./src/routes/orderRoute');

// ==========================================
// 1. KONFIGURASI SWAGGER
// ==========================================
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Pizzeria API',
            version: '1.0.0',
            description: 'API Pizzeria Lengkap (Auth + Menu)',
        },
        servers: [
            { url: 'http://localhost:5000' }
        ],
        // Setup Security (Token)
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
        paths: {
            // === AUTH (LOGIN) ===
            '/api/login': {
                post: {
                    summary: 'Login Admin (Dapatkan Token)',
                    tags: ['Auth'],
                    security: [], // Public endpoint (gak butuh token)
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        email: { type: 'string', example: 'admin@pizzeria.com' },
                                        password: { type: 'string', example: '123456' } // Password admin kamu
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Login Berhasil (Copy accessToken-nya!)' },
                        400: { description: 'Email/Password Salah' }
                    }
                }
            },
            // === MENU ===
            '/api/menu': {
                get: {
                    summary: 'Ambil semua menu pizza',
                    tags: ['Menu'],
                    security: [], 
                    responses: { 200: { description: 'Sukses' } }
                },
                post: {
                    summary: 'Tambah Menu (Butuh Token)',
                    tags: ['Menu'],
                    requestBody: {
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        price: { type: 'integer' },
                                        category: { 
                                            type: 'string', 
                                            enum: ['food', 'drink', 'snack'], // Supaya user cuma bisa pilih 2 ini
                                            example: 'food' 
                                        },
                                        description: { type: 'string', example: 'Deskripsi menu...' },
                                        image: { type: 'string', format: 'binary' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 201: { description: 'Created' } }
                }
            },
            '/api/menu/{id}': {
                put: {
                    summary: 'Update Menu',
                    tags: ['Menu'],
                    parameters: [{ in: 'path', name: 'id', schema: { type: 'integer' }, required: true }],
                    requestBody: {
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        price: { type: 'integer' },
                                        category: { 
                                            type: 'string', 
                                            enum: ['food', 'drink', 'cemilan'], // Supaya user cuma bisa pilih 2 ini
                                            example: 'food' 
                                        },
                                        description: { type: 'string', example: 'Deskripsi menu...' },
                                        image: { type: 'string', format: 'binary' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'Updated' } }
                },
                delete: {
                    summary: 'Hapus Menu',
                    tags: ['Menu'],
                    parameters: [{ in: 'path', name: 'id', schema: { type: 'integer' }, required: true }],
                    responses: { 200: { description: 'Deleted' } }
                }
            }
        }
    },
    apis: [] 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// ==========================================
// 2. SERVER SETUP
// ==========================================
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api', authRoutes); // Pastikan authRoutes menghandle /login
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const startServer = async () => {
    try {
        await db.authenticate();
        console.log('✅ Database OK');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📃 Dokumentasi: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

startServer();
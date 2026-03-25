import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { conectarDB } from './db.js';

// Importar rutas
import productosRouter from './routes/productos.js';
import clientesRouter from './routes/clientes.js';
import reservasRouter from './routes/reservas.js';
import horariosRouter from './routes/horarios.js';
import usuariosRouter from './routes/usuarios.js';
import authRouter, { authConfig } from "./routes/auth.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// ========================================
// MIDDLEWARES
// ========================================

app.use(cors());
app.use(express.json());

// Configurar Passport (para auth.js)
authConfig();

// Logger simple
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toLocaleString()}`);
    next();
});

// ========================================
// RUTAS
// ========================================

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: ' API Nalu-Marroquineria funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            productos: '/productos',
            clientes: '/clientes',
            reservas: '/reservas',
            horarios: '/horarios'
        }
    });
});

// Ruta para verificar estado de la BD
app.get('/health', async (req, res) => {
    try {
        const { db } = await import('./db.js');
        const [result] = await db.execute('SELECT 1 as ok');
        res.json({ 
            success: true, 
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            database: 'disconnected',
            error: error.message 
        });
    }
});

// Montar rutas de la API
app.use('/productos', productosRouter);
app.use('/clientes', clientesRouter);
app.use('/reservas', reservasRouter);
app.use('/horarios', horariosRouter);
app.use('/usuarios', usuariosRouter);
app.use("/auth", authRouter);

// ========================================
// MANEJO DE ERRORES
// ========================================

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Ruta no encontrada',
        path: req.url
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Error interno del servidor'
    });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

async function iniciarServidor() {
    try {
        await conectarDB();
        console.log('✅ Conexión a MySQL establecida');
        
        app.listen(PORT, () => {
            console.log('\n📋 Endpoints disponibles:');
            console.log(`   GET    http://localhost:${PORT}/`);
            console.log(`   GET    http://localhost:${PORT}/health`);
            console.log(`   CRUD   http://localhost:${PORT}/productos`);
            console.log(`   CRUD   http://localhost:${PORT}/clientes`);
            console.log(`   CRUD   http://localhost:${PORT}/reservas`);
            console.log(`   CRUD   http://localhost:${PORT}/horarios\n`);
        });
    } catch (error) {
        console.error('Error al iniciar servidor:', error.message);
        process.exit(1);
    }
}

iniciarServidor();
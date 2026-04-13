import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { conectarDB } from './db.js';

// Importar rutas
import authRouter, { authConfig } from "./routes/auth.js"; 
import usuariosRouter from './routes/usuarios.js';
import productosRouter from './routes/productos.js';
import clientesRouter from './routes/clientes.js';
import categoriasRouter from './routes/categorias.js';
import variantesRouter from './routes/variantes.js'; 
// import pedidosRouter from './routes/pedidos.js';     

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARES
// ========================================
app.use(cors());
app.use(express.json());

// Configurar Passport
authConfig();

// Logger simple
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toLocaleString()}`);
    next();
});

// ========================================
// RUTAS
// ========================================

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: '👜 API Nalu Marroquinería - Gestión de Stock y Ventas',
        version: '1.0.0',
        endpoints: {
            auth: '/auth',
            productos: '/productos',
            clientes: '/clientes',
            // variantes: '/variantes',
            // pedidos: '/pedidos'
        }
    });
});

// Salud de la BD
app.get('/health', async (req, res) => {
    try {
        const { pool } = await import('./db.js');
        const [result] = await pool.execute('SELECT 1 as ok');
        res.json({ success: true, database: 'connected' });
    } catch (error) {
        res.status(500).json({ success: false, database: 'disconnected', error: error.message });
    }
});

// rutas
app.use("/auth", authRouter);
app.use('/usuarios', usuariosRouter);
app.use('/productos', productosRouter);
app.use('/clientes', clientesRouter);
app.use('/categorias', categoriasRouter);
app.use('/variantes', variantesRouter);
// app.use('/pedidos', pedidosRouter);

// ========================================
// MANEJO DE ERRORES
// ========================================
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

// ========================================
// INICIAR SERVIDOR
// ========================================
async function iniciarServidor() {
    try {
        await conectarDB();
        app.listen(PORT, () => {
            console.log(`✅ Servidor Nalu Marroquinería corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar servidor:', error.message);
        process.exit(1);
    }
}

iniciarServidor();
import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

// Usamos createPool en lugar de createConnection
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function conectarDB() {
    try {
        // Con pool, basta con pedir una conexion para probar
        const connection = await pool.getConnection();
        console.log('Conectado a MySQL Railway (Pool)');
        console.log(`Base de datos: ${process.env.DB_NAME}`);
        connection.release(); // Importante: liberar la conexion al terminar la prueba
        return pool;
    } catch (error) {
        console.error('Error conectando a MySQL:', error.message);
        throw error;
    }
}
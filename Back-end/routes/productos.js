import { body, query } from "express-validator";
import express from "express";
import { pool } from "../db.js";
import { esAdmin, verificarValidaciones, validarId } from "../middlewares/validaciones.js";
import { verificarAutenticacion } from "./auth.js"; 
import upload from "../middlewares/upload.js"; //  middleware de Cloudinary

const router = express.Router();

// Validaciones para filtros
const validarFiltros = [
  query("nombre").isString().optional(),
  query("categoria_id").isInt({ min: 1 }).optional(),
  query("activo").isBoolean().optional(),
];

// Validaciones para crear/actualizar producto
const validarProducto = [
  body("nombre", "Nombre inválido").isString().isLength({ min: 1, max: 100 }),
  body("descripcion", "Descripción inválida").isString().optional(),
  body("precio_base", "Precio base inválido").isFloat({ min: 0.01 }), // Cambio de precio -> precio_base
  body("categoria_id", "Categoría inválida").isInt({ min: 1 }),
  body("activo").isBoolean().optional(),
];

// GET - Listar productos con filtros
router.get("/", validarFiltros, verificarValidaciones, async (req, res) => {
  try {
    const filtros = [];
    const parametros = [];
    const { nombre, categoria_id, activo } = req.query;

    if (nombre) {
      filtros.push("p.nombre LIKE ?");
      parametros.push(`%${nombre}%`);
    }

    if (categoria_id !== undefined) {
      filtros.push("p.categoria_id = ?");
      parametros.push(Number(categoria_id));
    }

    if (activo !== undefined) {
      filtros.push("p.activo = ?");
      parametros.push(activo === 'true' || activo === true ? 1 : 0);
    }

    let sql = `
      SELECT 
        p.id, 
        p.nombre, 
        p.descripcion,
        p.precio_base, 
        p.activo,
        p.imagen_principal,
        c.nombre AS categoria 
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id
    `;

    if (filtros.length > 0) {
      sql += " WHERE " + filtros.join(" AND ");
    }

    sql += " ORDER BY p.categoria_id, p.nombre";

    const [rows] = await pool.execute(sql, parametros);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).json({ success: false, message: "Error al listar productos" });
  }
});

// GET - Obtener producto por ID
router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.execute(
      `SELECT p.*, c.nombre AS categoria 
       FROM productos p 
       LEFT JOIN categorias c ON p.categoria_id = c.id 
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ success: false, message: "Error al obtener producto" });
  }
});

// POST - Crear producto (Con subida de imagen opcional)
// Usamos upload.single('imagen') para recibir el archivo
router.post("/", upload.single('imagen'), verificarAutenticacion, 
  esAdmin, validarProducto, verificarValidaciones, async (req, res) => {
  try {
    const { nombre, descripcion, precio_base, categoria_id, activo } = req.body;
    
    // Si se subió una imagen, Cloudinary nos da la URL en req.file.path
    const imagen_principal = req.file ? req.file.path : null;

    // Verificar nombre duplicado
    const [existe] = await pool.execute("SELECT id FROM productos WHERE nombre = ?", [nombre]);
    if (existe.length > 0) {
      return res.status(400).json({ success: false, message: "Ya existe un producto con ese nombre" });
    }

    const [result] = await pool.execute(
      `INSERT INTO productos 
        (nombre, descripcion, precio_base, categoria_id, activo, imagen_principal) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion || null, precio_base, categoria_id, activo !== undefined ? activo : 1, imagen_principal]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, nombre, precio_base, imagen_principal },
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ success: false, message: "Error al crear producto" });
  }
});

// PUT - Actualizar producto
router.put("/:id", upload.single('imagen'), verificarAutenticacion, 
  esAdmin, validarId, validarProducto, verificarValidaciones, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, precio_base, categoria_id, activo } = req.body;

    const [productoExiste] = await pool.execute("SELECT id, imagen_principal FROM productos WHERE id = ?", [id]);
    if (productoExiste.length === 0) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    // Si viene imagen nueva, la usamos; si no, mantenemos la anterior
    const imagen_principal = req.file ? req.file.path : productoExiste[0].imagen_principal;

    await pool.execute(
      `UPDATE productos 
       SET nombre = ?, descripcion = ?, precio_base = ?, categoria_id = ?, activo = ?, imagen_principal = ?
       WHERE id = ?`,
      [nombre, descripcion || null, precio_base, categoria_id, activo !== undefined ? activo : 1, imagen_principal, id]
    );

    res.json({ success: true, message: "Producto actualizado" });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ success: false, message: "Error al actualizar producto" });
  }
});

// DELETE - Eliminar producto
router.delete("/:id", verificarAutenticacion, 
  esAdmin, validarId, verificarValidaciones, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [productoExiste] = await pool.execute("SELECT id FROM productos WHERE id = ?", [id]);
    if (productoExiste.length === 0) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    await pool.execute("DELETE FROM productos WHERE id = ?", [id]);
    res.json({ success: true, message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ success: false, message: "Error al eliminar producto" });
  }
});

export default router;
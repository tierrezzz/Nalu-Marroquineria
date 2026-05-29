import express from "express";
import { pool } from "../db.js";
import { verificarAutenticacion } from "./auth.js";
import { esAdmin, validarId, verificarValidaciones } from "../middlewares/validaciones.js";

const router = express.Router();

// LISTAR CLIENTES (B de ABM - Leer/Listar) - Solo Admin
router.get("/", verificarAutenticacion, esAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.*, u.username as email 
      FROM clientes c
      INNER JOIN usuarios u ON c.usuario_id = u.id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener la lista" });
  }
});

// VER MI PERFIL
router.get("/me", verificarAutenticacion, async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM clientes WHERE usuario_id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Perfil incompleto" });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error de servidor" });
  }
});

// CREAR PERFIL (A de ABM - Alta)
router.post("/", verificarAutenticacion, async (req, res) => {
  try {
    const { nombre_completo, dni, telefono } = req.body;
    const usuario_id = req.user.id;

    await pool.execute(
      "INSERT INTO clientes (usuario_id, nombre_completo, dni, telefono) VALUES (?, ?, ?, ?)",
      [usuario_id, nombre_completo, dni, telefono]
    );

    res.status(201).json({ success: true, message: "Datos guardados correctamente" });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: "DNI ya registrado" });
    res.status(500).json({ success: false, message: "Error al guardar" });
  }
});

// MODIFICAR PERFIL (M de ABM - Modificación)
router.put("/me", verificarAutenticacion, async (req, res) => {
    try {
      const { nombre_completo, dni, telefono } = req.body;
      await pool.execute(
        "UPDATE clientes SET nombre_completo = ?, dni = ?, telefono = ? WHERE usuario_id = ?",
        [nombre_completo, dni, telefono, req.user.id]
      );
      res.json({ success: true, message: "Perfil actualizado" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al actualizar" });
    }
});

export default router;
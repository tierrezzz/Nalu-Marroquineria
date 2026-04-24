import express from "express";
import { pool } from "../db.js";
import { body } from "express-validator";
import { esAdmin, validarId, verificarValidaciones } from "../middlewares/validaciones.js";
import upload from "../middlewares/upload.js";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// GET - Listar variantes de un producto específico
router.get("/producto/:producto_id", async (req, res) => {
  try {
    const { producto_id } = req.params;
    const [rows] = await pool.execute(
      "SELECT * FROM variantes WHERE producto_id = ?",
      [producto_id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener variantes" });
  }
});

// POST - Crear una variante (Color/Material/Stock)
router.post(
  "/",
  verificarAutenticacion,
  esAdmin,
  upload.single('imagen'), // Para la foto del color específico
  [
    body("producto_id").isInt({ min: 1 }),
    body("color").isString().notEmpty(),
    body("material").isString().notEmpty(),
    body("stock").isInt({ min: 0 })
  ],
  verificarValidaciones,
  async (req, res) => {
    try {
      const { producto_id, color, material, stock } = req.body;
      const imagen_url = req.file ? req.file.path : null;

      const [result] = await pool.execute(
        `INSERT INTO variantes (producto_id, color, material, stock, imagen_url) 
         VALUES (?, ?, ?, ?, ?)`,
        [producto_id, color, material, stock, imagen_url]
      );

      res.status(201).json({ 
        success: true, 
        data: { id: result.insertId, color, stock, imagen_url } 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al crear variante" });
    }
  }
);

// PUT - Actualizar stock o color
router.put("/:id", verificarAutenticacion, esAdmin , validarId, verificarValidaciones, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { color, material, stock } = req.body;
        
        await pool.execute(
            "UPDATE variantes SET color = ?, material = ?, stock = ? WHERE id = ?",
            [color, material, stock, id]
        );
        
        res.json({ success: true, message: "Variante actualizada" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al actualizar variante" });
    }
});

// DELETE - Eliminar variante
router.delete("/:id", verificarAutenticacion, esAdmin, validarId, verificarValidaciones, async (req, res) => {
  try {
    await pool.execute("DELETE FROM variantes WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Variante eliminada" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar variante" });
  }
});

export default router;
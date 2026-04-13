import express from "express";
import { pool } from "../db.js";
import { body } from "express-validator";
import {
  esAdmin,
  validarId,
  verificarValidaciones,
} from "../middlewares/validaciones.js";
import { verificarAutenticacion } from "./auth.js"; // Para que solo el admin lo use

const router = express.Router();

// GET - Listar todas las categorías
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM categorias ORDER BY nombre ASC",
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener categorías" });
  }
});

// POST - Crear categoría (Protegido)
router.post(
  "/",
  esAdmin,
  verificarAutenticacion,
  body("nombre", "El nombre es requerido").isString().notEmpty(),
  verificarValidaciones,
  async (req, res) => {
    try {
      const { nombre } = req.body;
      const [result] = await pool.execute(
        "INSERT INTO categorias (nombre) VALUES (?)",
        [nombre],
      );
      res
        .status(201)
        .json({ success: true, data: { id: result.insertId, nombre } });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ success: false, message: "La categoría ya existe" });
      }
      res
        .status(500)
        .json({ success: false, message: "Error al crear categoría" });
    }
  },
);

// DELETE - Eliminar categoría (Solo si no tiene productos asociados)
router.delete(
  "/:id", esAdmin,
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      // Verificar si hay productos usándola
      const [productos] = await pool.execute(
        "SELECT id FROM productos WHERE categoria_id = ?",
        [id],
      );
      if (productos.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "No se puede eliminar: hay productos asociados a esta categoría",
        });
      }

      await pool.execute("DELETE FROM categorias WHERE id = ?", [id]);
      res.json({ success: true, message: "Categoría eliminada" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al eliminar" });
    }
  },
);

export default router;

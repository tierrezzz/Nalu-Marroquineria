import express from "express";
import { pool } from "../db.js";
import { validarId, verificarValidaciones, esAdmin } from "../middlewares/validaciones.js"; 
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// GET /usuarios - Listar todos (SOLO ADMIN)
router.get("/", verificarAutenticacion, esAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT id, username, rol FROM usuarios"); 
    res.json({ success: true, usuarios: rows });
  } catch (error) {
    console.error("Error en GET /usuarios:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});

// GET /usuarios/:id - Obtener uno (ADMIN o el mismo usuario)
router.get("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Seguridad extra: Solo admin puede ver a otros. El usuario común solo se ve a sí mismo.
    if (req.user.rol !== 'admin' && req.user.id !== id) {
        return res.status(403).json({ success: false, error: "No tienes permiso para ver este perfil" });
    }

    const [rows] = await pool.execute("SELECT id, username, rol FROM usuarios WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }
    res.json({ success: true, usuario: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error interno" });
  }
});

// POST /usuarios - Registro de usuario (Público - por defecto CLIENTE)
router.post(
  "/",
  body("username", "Nombre de usuario inválido").notEmpty().isLength({ max: 50 }), 
  body("password", "Contraseña inválida (mín. 8 caracteres, 1 número)").isStrongPassword({
    minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 0,
  }),
  verificarValidaciones,
  async (req, res) => {
    try {
      const { username, password } = req.body; 

      const [usernames] = await pool.execute("SELECT id FROM usuarios WHERE username = ?", [username]);
      if (usernames.length > 0) {
        return res.status(400).json({ success: false, error: "El nombre de usuario ya existe" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 12);

      // Importante: El rol por defecto es 'cliente' (seguridad)
      const [result] = await pool.execute(
        "INSERT INTO usuarios (username, password, rol) VALUES (?, ?, 'cliente')",
        [username, hashedPassword]
      );

      res.status(201).json({
        success: true,
        data: { id: result.insertId, username, rol: 'cliente' }, 
      });

    } catch (error) {
       res.status(500).json({ success: false, error: "Error interno" });
    }
  }
);

// PUT /usuarios/:id - Actualizar (ADMIN o el mismo usuario)
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { username, password, rol } = req.body;

    // Solo el Admin puede cambiar el ROL de alguien
    if (rol && req.user.rol !== 'admin') {
        return res.status(403).json({ success: false, error: "No puedes cambiar tu propio rol" });
    }

    try {
      const [usuarioActual] = await pool.execute("SELECT * FROM usuarios WHERE id = ?", [id]);
      if (usuarioActual.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

      let nuevoPassword = password ? await bcrypt.hash(password, 12) : usuarioActual[0].password;
      let nuevoRol = (req.user.rol === 'admin' && rol) ? rol : usuarioActual[0].rol;

      await pool.execute(
        "UPDATE usuarios SET username = ?, password = ?, rol = ? WHERE id = ?",
        [username || usuarioActual[0].username, nuevoPassword, nuevoRol, id]
      );

      res.json({ success: true, message: "Usuario actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Error interno" });
    }
  }
);

// DELETE /usuarios/:id - Eliminar (SOLO ADMIN)
router.delete("/:id", verificarAutenticacion, esAdmin, validarId, verificarValidaciones, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.execute("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ success: true, message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error interno" });
  }
});

export default router;
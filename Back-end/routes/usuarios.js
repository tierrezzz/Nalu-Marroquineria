import express from "express";
import { pool } from "../db.js";
import { validarId, verificarValidaciones, esAdmin } from "../middlewares/validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// GET /usuarios - Listar todos (SOLO ADMIN)
router.get("/", verificarAutenticacion, esAdmin, async (req, res) => {
  try {
    // Cambiamos username por email en la consulta
    const [rows] = await pool.execute("SELECT id, email, rol, google_id FROM usuarios");
    res.json({ success: true, usuarios: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});

// GET /usuarios/:id - Obtener uno
router.get("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (req.user.rol !== 'admin' && req.user.id !== id) {
        return res.status(403).json({ success: false, error: "Acceso denegado" });
    }

    const [rows] = await pool.execute("SELECT id, email, rol FROM usuarios WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "No encontrado" });
    
    res.json({ success: true, usuario: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error interno" });
  }
});

// POST /usuarios - Registro MANUAL (Público)
router.post(
  "/",
  // VALIDACIÓN: Ahora verificamos que sea un EMAIL real
  body("email", "Debes ingresar un email válido").isEmail().normalizeEmail(), 
  body("password", "Contraseña débil (mín. 8 carac, 1 número)").isStrongPassword({
    minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 0,
  }),
  verificarValidaciones,
  async (req, res) => {
    try {
      const { email, password } = req.body; 

      // Verificar si el email ya existe
      const [existe] = await pool.execute("SELECT id FROM usuarios WHERE email = ?", [email]);
      if (existe.length > 0) {
        return res.status(400).json({ success: false, error: "Este email ya está registrado" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 12);

      // El registro manual siempre entra como 'cliente' y google_id NULL
      const [result] = await pool.execute(
        "INSERT INTO usuarios (email, password, rol) VALUES (?, ?, 'cliente')",
        [email, hashedPassword]
      );

      const payload = { id: result.insertId, email, rol: 'cliente' };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });

      res.status(201).json({
        success: true,
        token, 
        data: { id: result.insertId, email, rol: 'cliente' }, 
      });
    } catch (error) {
       res.status(500).json({ success: false, error: "Error interno" });
    }
  }
);

// PUT /usuarios/:id - Actualizar
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("email").optional().isEmail().normalizeEmail(),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { email, password, rol } = req.body;

    if (rol && req.user.rol !== 'admin') {
        return res.status(403).json({ success: false, error: "No puedes cambiar el rol" });
    }

    try {
      const [usuarioActual] = await pool.execute("SELECT * FROM usuarios WHERE id = ?", [id]);
      if (usuarioActual.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

      // Si cambia email, verificar disponibilidad
      if (email && email !== usuarioActual[0].email) {
          const [check] = await pool.execute("SELECT id FROM usuarios WHERE email = ?", [email]);
          if (check.length > 0) return res.status(400).json({ error: "Email ya en uso" });
      }

      let nuevoPassword = password ? await bcrypt.hash(password, 12) : usuarioActual[0].password;
      let nuevoRol = (req.user.rol === 'admin' && rol) ? rol : usuarioActual[0].rol;

      await pool.execute(
        "UPDATE usuarios SET email = ?, password = ?, rol = ? WHERE id = ?",
        [email || usuarioActual[0].email, nuevoPassword, nuevoRol, id]
      );

      res.json({ success: true, message: "Usuario actualizado" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Error interno" });
    }
  }
);

// DELETE /usuarios/:id
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
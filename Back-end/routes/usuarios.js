import express from "express";
import { pool } from "../db.js";
import { validarId, verificarValidaciones } from "../middlewares/validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// GET /usuarios - Listar todos los usuarios
router.get("/", verificarAutenticacion, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, username FROM usuarios"
    );

    res.json({
      success: true,
      usuarios: rows,
    });

  } catch (error) {
    console.error("Error en GET /usuarios:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});

// GET /usuarios/:id - Obtener un usuario por ID (NUEVO)
router.get("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.execute(
      "SELECT id, username FROM usuarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }

    res.json({
      success: true,
      usuario: rows[0],
    });

  } catch (error) {
    console.error("Error en GET /usuarios/:id:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});

// POST /usuarios - Registro de usuario
router.post(
  "/",
  body("username", "Nombre de usuario inválido (máx 50 carac.)").notEmpty().isLength({ max: 50 }), 
  body("password", "Contraseña inválida (mín. 8 caracteres, 1 número)").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  }),
  verificarValidaciones,
  async (req, res) => {
    try {
      const { username, password } = req.body; 

      // Verificar si el username ya existe
       const [usernames] = await pool.execute(
        "SELECT id FROM usuarios WHERE username = ?",
        [username]
      );
      
      if (usernames.length > 0) {
        return res
          .status(400)
          .json({ success: false, error: "El nombre de usuario ya está registrado" });
      }
      
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 12);

      // Guardar en la base de datos
      const [result] = await pool.execute(
        "INSERT INTO usuarios (username, password) VALUES (?, ?)",
        [username, hashedPassword]
      );

      res.status(201).json({
        success: true,
        data: { id: result.insertId, username }, 
      });

    } catch (error) {
       console.error("Error en POST /usuarios:", error);
       res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  }
);

// PUT /usuarios/:id - Actualizar usuario (NUEVO - Aquí estaba tu error)
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  // Validaciones opcionales (solo validan si el campo viene en el body)
  body("username", "Nombre de usuario inválido").optional().isLength({ max: 50 }), 
  body("password", "Contraseña inválida").optional().isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  }),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { username, password } = req.body;

    try {
      // 1. Verificar si el usuario existe
      const [usuarioActual] = await pool.execute("SELECT * FROM usuarios WHERE id = ?", [id]);
      
      if (usuarioActual.length === 0) {
        return res.status(404).json({ success: false, error: "Usuario no encontrado" });
      }

      // 2. Si intenta cambiar el username, verificar que no esté ocupado por otro
      if (username && username !== usuarioActual[0].username) {
        const [existe] = await pool.execute("SELECT id FROM usuarios WHERE username = ? AND id != ?", [username, id]);
        if (existe.length > 0) {
          return res.status(400).json({ success: false, error: "El nombre de usuario ya está en uso" });
        }
      }

      // 3. Preparar la nueva contraseña solo si la envió
      let nuevoPassword = usuarioActual[0].password;
      if (password) {
        nuevoPassword = await bcrypt.hash(password, 12);
      }
      
      const nuevoUsername = username || usuarioActual[0].username;

      // 4. Actualizar en BD
      await pool.execute(
        "UPDATE usuarios SET username = ?, password = ? WHERE id = ?",
        [nuevoUsername, nuevoPassword, id]
      );

      res.json({
        success: true,
        data: { id, username: nuevoUsername },
        message: "Usuario actualizado correctamente"
      });

    } catch (error) {
      console.error("Error en PUT /usuarios/:id:", error);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  }
);

// DELETE /usuarios/:id - Eliminar usuario
router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    try {
      const [result] = await pool.execute("DELETE FROM usuarios WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado" });
      }
      res.json({ success: true, message: "Usuario eliminado" });
    } catch (error) {
      console.error("Error en DELETE /usuarios/:id :", error);
      res.status(500).json({ success: false, error: "Error interno" });
    }
  }
);

export default router;
import express from "express";
import { pool } from "../db.js";
import { verificarValidaciones } from "../middlewares/validaciones.js"; 
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

// Configuracion de la estrategia JWT para Passport
export function authConfig() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      // El payload es lo que pusimos en el token: { userId: ... }
      try {
        // Opcional: Verificar que el usuario aún existe en la DB
        /* const [rows] = await pool.execute("SELECT id FROM usuarios WHERE id = ?", [payload.userId]);
        if (rows.length === 0) return next(null, false);
        */
        next(null, payload); 
      } catch (error) {
        next(error, false);
      }
    })
  );
}

// Middleware para proteger rutas
export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

// Ruta de Login
router.post(
    "/login",
    // Cambiado: Ahora validamos username en lugar de email
    body("username", "Usuario inválido").notEmpty(),
    body("password", "Contraseña requerida").notEmpty(),
    verificarValidaciones,
    async (req, res) => {
      try {
        const { username, password } = req.body;
  
        // Buscar al usuario por USERNAME (no por email)
        const [usuarios] = await pool.execute(
          "SELECT * FROM usuarios WHERE username = ?",
          [username]
        );
  
        if (usuarios.length === 0) {
          return res
            .status(401) // 401 Unauthorized es mejor para fallos de login
            .json({ success: false, error: "Usuario o contraseña inválidos" });
        }
  
        // Verificar la contraseña 
        const usuario = usuarios[0];
        const hashedPassword = usuario.password; 
        const passwordComparada = await bcrypt.compare(password, hashedPassword);
  
        if (!passwordComparada) {
          return res
            .status(401)
            .json({ success: false, error: "Usuario o contraseña inválidos" });
        }
  
        // Generar el token JWT
        const payload = { userId: usuario.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "4H",
        });
  
        // Enviar respuesta
        res.json({
          success: true,
          token,
          username: usuario.username 
        });
  
      } catch (error) {
          console.error("Error en /login:", error);
          res.status(500).json({ success: false, error: "Error interno del servidor" });
      }
    }
  );

export default router;
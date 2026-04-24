import express from "express";
import { pool } from "../db.js";
import { verificarValidaciones } from "../middlewares/validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; // Importamos Google

const router = express.Router();

// Configuración de las estrategias de Passport
export function authConfig() {
  // 1. ESTRATEGIA JWT (Para proteger rutas normales)
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (payload, next) => {
      try {
        // El payload contiene: { id, email, rol }
        next(null, payload);
      } catch (error) {
        next(error, false);
      }
    }),
  );

  // 2. ESTRATEGIA GOOGLE
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const googleId = profile.id;

          // Buscamos si ya existe el usuario
          const [usuarios] = await pool.execute(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
          );

          if (usuarios.length > 0) {
            const usuario = usuarios[0];
            // Si existe pero no tenía google_id, lo vinculamos (Híbrido)
            if (!usuario.google_id) {
              await pool.execute(
                "UPDATE usuarios SET google_id = ? WHERE id = ?",
                [googleId, usuario.id]
              );
            }
            return done(null, usuario);
          }

          // Si no existe, lo creamos
          const [nuevoUsuario] = await pool.execute(
            "INSERT INTO usuarios (email, google_id, rol) VALUES (?, ?, 'cliente')",
            [email, googleId]
          );

          const userCreated = { id: nuevoUsuario.insertId, email, rol: 'cliente' };
          return done(null, userCreated);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Middleware para proteger rutas
export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

// --- RUTA DE LOGIN MANUAL ---
router.post(
  "/login",
  body("email", "Debes ingresar un email válido").isEmail().normalizeEmail(),
  body("password", "Contraseña requerida").notEmpty(),
  verificarValidaciones,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const [usuarios] = await pool.execute(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
      );

      if (usuarios.length === 0) {
        return res.status(401).json({ success: false, error: "Credenciales inválidas" });
      }

      const usuario = usuarios[0];

      if (!usuario.password && usuario.google_id) {
          return res.status(401).json({ 
              success: false, 
              error: "Esta cuenta se registró con Google. Por favor, usa el botón de Google Login." 
          });
      }

      const passwordComparada = await bcrypt.compare(password, usuario.password);
      if (!passwordComparada) {
        return res.status(401).json({ success: false, error: "Credenciales inválidas" });
      }

      const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });

      res.json({
        success: true,
        token,
        usuario: { id: usuario.id, email: usuario.email, rol: usuario.rol }
      });
    } catch (error) {
      console.error("Error en /login:", error);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  },
);

// --- RUTAS DE GOOGLE ---

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// El callback donde Google devuelve la info
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const payload = {
      id: req.user.id,
      email: req.user.email,
      rol: req.user.rol,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });

    // Redirigimos al front con el token. 
    // Luego en React capturaremos este token de la URL.
    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  }
);

export default router;
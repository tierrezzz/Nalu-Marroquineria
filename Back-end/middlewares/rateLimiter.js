import rateLimit from 'express-rate-limit';

// Limitador para uso general de la API
export const limatadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, 
  message: {
    success: false,
    message: "Demasiadas peticiones desde esta IP, intentá de nuevo más tarde."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitador estricto para creación de cuentas
export const limitadorRegistro = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, 
  message: {
    success: false,
    message: "Has intentado crear demasiadas cuentas. Por seguridad, probá de nuevo en una hora."
  }
});
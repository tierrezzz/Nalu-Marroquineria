import { param, validationResult } from "express-validator";

// Validación genérica de ID para rutas tipo /:id
export const validarId = param("id").isInt({ min: 1 });

// Middleware para verificar los resultados de express-validator
export const verificarValidaciones = (req, res, next) => {
  const validacion = validationResult(req);
  
  if (!validacion.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errores: validacion.array() 
    });
  }
  
  next();
};

/**
 * Middleware para restringir acceso solo a Administradores.
 * Requiere que se haya ejecutado previamente 'verificarAutenticacion' 
 * (Passport o JWT) para tener disponible el objeto 'req.user'.
 */
export const esAdmin = (req, res, next) => {
  // Verificamos si existe el usuario y si su rol es 'admin'
  if (req.user && req.user.rol === 'admin') {
    return next(); // El usuario es admin, puede continuar
  }

  // Si no es admin, cortamos la petición con un 403 (Prohibido)
  return res.status(403).json({
    success: false,
    message: "Acceso denegado: Se requieren permisos de administrador para realizar esta acción."
  });
};
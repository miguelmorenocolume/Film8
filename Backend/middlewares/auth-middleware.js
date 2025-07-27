import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para proteger rutas privadas
export const protect = async (req, res, next) => {
  let token;

  // Verifica si el token viene en los headers con el formato Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extrae el token del header
      token = req.headers.authorization.split(' ')[1];

      // Verifica el token con la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca al usuario en la base de datos sin devolver la contraseña
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      // Adjunta el usuario al objeto req para usarlo en otras rutas
      req.user = user;
      next();
    } catch (error) {
      // Si el token no es válido o ha expirado lanza un error
      console.error('Error en autenticación:', error);
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  } else {
    // Si no se proporciona el token lanza otro error
    console.error('Token no proporcionado');
    return res.status(401).json({ message: 'No autorizado, token no presente' });
  }
};

// Middleware para permitir acceso solo a administradores
export const admin = (req, res, next) => {
  // Comprueba si el usuario está autenticado y es administrador
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    // Si no es admin, devuelve un error de acceso
    res.status(403).json({ message: 'Acceso denegado: solo para administradores' });
  }
};

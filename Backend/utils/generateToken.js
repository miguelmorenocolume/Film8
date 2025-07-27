import jwt from 'jsonwebtoken';

// Genera un token JWT para el usuario.
const generateToken = (userId, isAdmin) => {
  return jwt.sign({ id: userId, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export default generateToken;

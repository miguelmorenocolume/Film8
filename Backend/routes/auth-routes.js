import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  createUserByAdmin,
  updateUserById,
  deleteUserById,
} from '../controllers/auth-controller.js';
import { protect, admin } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Registro público para usuarios normales
router.post('/register', registerUser);

// Login público
router.post('/login', loginUser);

// Obtener perfil usuario autenticado
router.get('/me', protect, async (req, res) => {
  const user = req.user;
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(user);
});

// Obtener todos usuarios (solo admin)
router.get('/users', protect, admin, getAllUsers);

// Crear usuario (solo admin)
router.post('/users', protect, admin, createUserByAdmin);

// Actualizar usuario (solo admin)
router.put('/users/:id', protect, admin, updateUserById);

// Eliminar usuario (solo admin)
router.delete('/users/:id', protect, admin, deleteUserById);

export default router;

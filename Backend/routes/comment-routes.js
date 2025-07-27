import express from 'express';
import { protect, admin } from '../middlewares/auth-middleware.js';
import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByMovie,
  getAllComments,
} from '../controllers/comment-controller.js';

const router = express.Router();

// Crear comentario (requiere autenticación)
router.post('/', protect, createComment);

// Editar comentario por ID (requiere autenticación)
router.put('/:id', protect, updateComment);

// Eliminar comentario por ID (requiere autenticación)
router.delete('/:id', protect, deleteComment);

// Obtener comentarios de una película por ID
router.get('/movie/:movieId', getCommentsByMovie);

// Obtener todos los comentarios (sin restricciones)
router.get('/', getAllComments);

export default router;

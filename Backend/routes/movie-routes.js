import express from 'express';
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie
} from '../controllers/movie-controller.js';

import { protect, admin } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Obtener todas las películas (público)
router.get('/', getMovies);

// Obtener una película por ID (público)
router.get('/:id', getMovieById);

// Crear película (solo admin)
router.post('/', protect, admin, createMovie);

// Actualizar película por ID (solo admin)
router.put('/:id', protect, admin, updateMovie);

// Eliminar película por ID (solo admin)
router.delete('/:id', protect, admin, deleteMovie);

export default router;

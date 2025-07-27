import express from 'express';
import { protect } from '../middlewares/auth-middleware.js';
import {
  createReservation,
  getUserReservations,
  getAllActiveReservations,
  updateReservation,
  deleteReservation,
} from '../controllers/reservation-controller.js';

const router = express.Router();

// Crear reserva
router.post('/', protect, createReservation);

// Obtener reservas del usuario autenticado
router.get('/', protect, getUserReservations);

// Obtener todas las reservas activas
router.get('/all', getAllActiveReservations);

// Actualizar reserva (PUT) (requiere autenticación)
router.put('/:id', protect, updateReservation);

// Eliminar reserva (DELETE) (requiere autenticación)
router.delete('/:id', protect, deleteReservation);

export default router;

import Reservation from '../models/Reservation.js';
import Movie from '../models/Movie.js';

// Crear una nueva reserva
export const createReservation = async (req, res) => {
  try {
    const { user, movie, expiresAt } = req.body;

    if (!user || !movie || !expiresAt) {
      return res.status(400).json({ message: 'Faltan datos para crear la reserva' });
    }

    // Verifica si la película ya está reservada
    const existingReservation = await Reservation.findOne({ movie });
    if (existingReservation) {
      return res.status(400).json({ message: 'La película ya está reservada' });
    }

    // Verifica si la película existe
    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    const reservation = await Reservation.create({
      user,
      movie,
      reservedAt: new Date(),
      expiresAt: new Date(expiresAt),
    });

    res.status(201).json({ message: 'Reserva creada correctamente', reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener las reservas activas de un usuario (administrador o usuario logueado)
export const getUserReservations = async (req, res) => {
  try {
    const now = new Date();
    const reservations = await Reservation.find({
      user: req.user._id,
      expiresAt: { $gt: now }
    })
      .populate('movie', 'title duration genre director releaseYear')
      .sort({ expiresAt: 1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las reservas activas (solo admins)
export const getAllActiveReservations = async (req, res) => {
  try {
    const now = new Date();
    const reservations = await Reservation.find({ expiresAt: { $gt: now } })
      .populate('user', 'username email')
      .populate('movie', 'title');

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar reservas expiradas
export const deleteExpiredReservations = async () => {
  try {
    const now = new Date();
    const result = await Reservation.deleteMany({ expiresAt: { $lte: now } });
    // Mensaje para controlar el número de reservas eliminadas
    console.log(`Reservas expiradas eliminadas: ${result.deletedCount}`);
  } catch (error) {
    console.error('Error al eliminar reservas expiradas:', error);
  }
};

// Actualizar duración de una reserva
export const updateReservation = async (req, res) => {
  try {
    const { durationMinutes } = req.body;
    const reservationId = req.params.id;
    const loggedUserId = req.user._id;

    if (!durationMinutes) {
      return res.status(400).json({ message: 'Falta duración para actualizar reserva' });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Verificación de permisos
    const isAdmin = req.user.role === 'admin';
    const isOwner = reservation.user.toString() === loggedUserId.toString();
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'No autorizado para modificar esta reserva' });
    }

    // Calcular nueva expiración
    const now = new Date();
    reservation.expiresAt = new Date(now.getTime() + durationMinutes * 60000);
    await reservation.save();

    res.json({ message: 'Reserva actualizada', reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una reserva
export const deleteReservation = async (req, res) => {
  const loggedUserId = req.user._id;
  const reservationId = req.params.id;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    //Un admin puede eliminar cualquier reserva y un usuario solo la suya
    if (!req.user.isAdmin && reservation.user.toString() !== loggedUserId.toString()) {
      return res.status(403).json({ message: 'No autorizado para eliminar esta reserva' });
    }

    // Elimina la reserva
    const result = await Reservation.deleteOne({ _id: reservationId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada para borrar' });
    }

    res.json({ message: 'Reserva eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/auth-routes.js';
import movieRoutes from './routes/movie-routes.js';
import commentRoutes from './routes/comment-routes.js';
import reservationRoutes from './routes/reservation-routes.js';

import { deleteExpiredReservations } from './controllers/reservation-controller.js';

// Carga las variables de entorno
dotenv.config();

// Conecta a la base de datos
connectDB();

// Crea instancia de Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reservations', reservationRoutes);

// Limpieza periódica de reservas expiradas cada minuto
setInterval(() => {
  deleteExpiredReservations();
}, 60000);

// Puerto y arranque del servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

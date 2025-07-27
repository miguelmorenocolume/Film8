import { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DashboardTable.css';

const ReservationModal = ({ movieId, onClose, onReserve }) => {
  // Obtiene el usuario autenticado desde el contexto
  const { user } = useAuth();
  // Hook de navegación para redirigir al usuario
  const navigate = useNavigate();

  // Estado para la fecha de expiración introducida por el usuario
  const [expiration, setExpiration] = useState('');
  // Estado para mostrar mensajes de error
  const [error, setError] = useState('');
  // Estado para mostrar mensajes de éxito
  const [successMsg, setSuccessMsg] = useState('');
  // Estado para indicar si se está procesando la solicitud
  const [loading, setLoading] = useState(false);

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    // Convierte la fecha de expiración a objeto Date
    const expiresAtDate = new Date(expiration);
    const now = new Date();

    // Valida que la fecha introducida sea válida y futura
    if (!expiration || isNaN(expiresAtDate.getTime()) || expiresAtDate <= now) {
      setError('Introduce una fecha de expiración válida y futura.');
      setLoading(false);
      return;
    }

    // Crea el objeto de datos para enviar al backend
    const data = {
      user: user._id,
      movie: movieId,
      expiresAt: expiresAtDate.toISOString(),
    };

    try {
      // Envía los datos al backend para crear la reserva
      const response = await axios.post('/reservations', data);
      onReserve(response.data);
      setSuccessMsg('Película reservada correctamente');
      setLoading(false);

      // Espera 500 ms y luego cierra el modal y redirige al perfil del usuario
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
        navigate('/profile');
      }, 500);

    } catch (err) {
      const msg = err.response?.data?.message || 'Error al crear la reserva';
      setError(msg);
      setLoading(false);
    }
  };
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Reservar película</h3>
        <form onSubmit={handleSubmit}>
          {/* Campo para seleccionar la fecha de expiración */}
          <label>
            Fecha de expiración:
            <input
              type="datetime-local"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          {successMsg && <p className="success">{successMsg}</p>}
          {/* Botones de acción del modal */}
          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Reservando...' : 'Confirmar'}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;

import { useEffect, useState } from 'react';
import api from '../api/axios.jsx';
import Navbar from '../components/Navbar.jsx';
import './ProfilePage.css';

const ProfilePage = () => {
  // Estado para almacenar los datos del usuario
  const [user, setUser] = useState(null);
  // Estado para almacenar las reservas del usuario
  const [reservations, setReservations] = useState([]);
  // Estado para controlar el cargando
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para obtener datos del usuario y sus reservas
    const fetchUserData = async () => {
      try {
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);

        // Ruta corregida: obtener reservas del usuario actual
        const reservationsRes = await api.get('/reservations');
        setReservations(reservationsRes.data);
      } catch (error) {
        // Manejo de error en la carga de datos
        console.error('Error al cargar usuario o reservas:', error.response?.data || error.message);
      } finally {
        // Finaliza el estado de carga
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Mostrar barra de carga mientras se obtienen datos
  if (loading) return (
    <div className="loading-container">
      <div className="loading-bar"></div>
    </div>
  );
  // Mensaje si no se encuentra usuario
  if (!user) return <p>No se ha encontrado el usuario.</p>;

  return (
    <>
      {/* Barra de navegación */}
      <Navbar />
      <div className="profile-page">
        <h2>Perfil de {user.username}</h2>
        <p><strong>Email:</strong> {user.email}</p>

        <h3>Películas Reservadas</h3>
        {/* Mostrar mensaje si no hay reservas */}
        {reservations.length === 0 ? (
          <p>No tienes reservas activas.</p>
        ) : (
          // Lista de reservas con título y fecha de expiración
          <ul>
            {reservations.map(reservation => (
              <li key={reservation._id}>
                {reservation.movie.title} - Reserva hasta: {new Date(reservation.expiresAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ProfilePage;

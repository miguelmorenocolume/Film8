import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.jsx';
import ReservationModal from '../components/ReservationModal.jsx';
import CommentModal from '../components/CommentModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

import './MovieDetailsPage.css';
const MovieDetailsPage = () => {

  // Obtener el parámetro id de la URL
  const { id } = useParams();
  // Obtener el usuario autenticado del contexto
  const { user } = useAuth();

  // Estado para almacenar los datos de la película
  const [movie, setMovie] = useState(null);
  // Estado para almacenar las reservas
  const [reservations, setReservations] = useState([]);
  // Estado para almacenar los comentarios de la película
  const [comments, setComments] = useState([]);
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  // Estado para mostrar/ocultar el modal de reserva
  const [showReservationModal, setShowReservationModal] = useState(false);
  // Estado para mostrar/ocultar el modal de comentario
  const [showCommentModal, setShowCommentModal] = useState(false);
  // Estado para almacenar posibles errores
  const [error, setError] = useState(null);

  // Estado para controlar si se está editando un comentario
  const [commentEditMode, setCommentEditMode] = useState(false);
  // Estado para almacenar el comentario que se va a editar
  const [commentToEdit, setCommentToEdit] = useState(null);


  // Cargar datos: película, reservas y comentarios al montar o cambiar id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, reservationsRes, commentsRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get('/reservations/all'),
          api.get(`/comments/movie/${id}`)
        ]);

        setMovie(movieRes.data);
        setReservations(reservationsRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        setError('Error cargando datos. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Comprobar si la película ya está reservada
  const isReserved = !!movie && Array.isArray(reservations) && reservations.some(r => {
    if (!r.movie) return false;
    const rMovieId = typeof r.movie === 'object' ? r.movie._id : r.movie;
    return rMovieId === movie._id;
  });

  // Fuente para el póster, imagen por defecto si no hay póster
  const posterSrc = movie?.poster
    ? `data:image/jpeg;base64,${movie.poster}`
    : '/default-poster.png';

  // Al confirmar reserva, cerrar modal y actualizar reservas
  const handleReserveConfirm = (newReservation) => {
    setShowReservationModal(false);
    setReservations(prev => [...prev, newReservation]);
  };

  // Añadir comentario nuevo y actualizar lista de comentarios
  const handleAddComment = async (text, rating) => {
    try {
      await api.post('/comments', {
        movie: movie._id,
        text,
        rating
      });
      const updated = await api.get(`/comments/movie/${movie._id}`);
      setComments(updated.data);
      setShowCommentModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al comentar');
    }
  };

  // Editar comentario existente y actualizar comentarios
  const handleEditComment = async (text, rating) => {
    try {
      await api.put(`/comments/${commentToEdit._id}`, {
        text,
        rating
      });
      const updated = await api.get(`/comments/movie/${movie._id}`);
      setComments(updated.data);
      setShowCommentModal(false);
      setCommentEditMode(false);
      setCommentToEdit(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al editar comentario');
    }
  };

  // Mostrar barra de carga mientras carga
  if (loading) return (
    <div className="loading-container">
      <div className="loading-bar"></div>
    </div>
  );

  // Mostrar error si hay y mensaje si no se encuentra película
  if (error) return <p>{error}</p>;
  if (!movie) return <p>Película no encontrada.</p>;

  // Buscar si el usuario ya tiene un comentario en esta película
  const userOwnComment = comments.find(c => c.user._id === user?._id);


  return (
    <>
      {/* Barra de navegación */}
      <Navbar />
      <div className="movie-details-wrapper">
        <div className="movie-details-card">
          {/* Imagen del póster de la película */}
          <div className="movie-poster-box">
            <img src={posterSrc} alt={movie.title} />
          </div>

          {/* Información y detalles de la película */}
          <div className="movie-meta">
            <h2>{movie.title}</h2>
            {movie.sinopsis && <p><strong>Sinopsis:</strong> {movie.sinopsis}</p>}
            <p><strong>Duración:</strong> {movie.duration} minutos</p>
            <p><strong>Género:</strong> {movie.genre}</p>
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Año de estreno:</strong> {movie.releaseYear}</p>

            {/* Indicador si la película está reservada */}
            {isReserved && <span className="reserved-label">Reservada</span>}

            {/* Botón para reservar la película, deshabilitado si ya está reservada */}
            <button
              className="reserve-button"
              onClick={() => setShowReservationModal(true)}
              disabled={isReserved}
            >
              {isReserved ? 'Ya reservada' : 'Reservar película'}
            </button>
          </div>
        </div>

        {/* Modal para realizar reserva */}
        {showReservationModal && (
          <ReservationModal
            movieId={movie._id}
            onClose={() => setShowReservationModal(false)}
            onReserve={handleReserveConfirm}
          />
        )}

        {/* Sección de comentarios */}
        <div className="comments-section">
          <h3>Comentarios</h3>

          {/* Botón para añadir comentario solo si el usuario no tiene uno */}
          {user && !userOwnComment && (
            <button
              className="comment-form-button"
              onClick={() => {
                setCommentEditMode(false);
                setCommentToEdit(null);
                setShowCommentModal(true);
              }}
            >
              Añadir comentario
            </button>
          )}

          {/* Listado de comentarios */}
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <p>
                <strong>{comment.user.username}</strong> – Puntuación: {comment.rating}
                {comment.edited && <span className="edited-tag"> (editado)</span>}
              </p>

              <p>{comment.text}</p>

              {/* Botón para editar comentario si es del usuario y no está editado */}
              {user && user._id === comment.user._id && !comment.edited && (
                <button
                  className="edit-comment-button"
                  onClick={() => {
                    setCommentEditMode(true);
                    setCommentToEdit(comment);
                    setShowCommentModal(true);
                  }}
                >
                  Editar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Modal para añadir o editar comentario */}
        {showCommentModal && (
          <CommentModal
            initialText={commentEditMode && commentToEdit ? commentToEdit.text : ''}
            initialRating={commentEditMode && commentToEdit ? commentToEdit.rating : 5}
            isEditing={commentEditMode}
            onClose={() => setShowCommentModal(false)}
            onSubmit={commentEditMode ? handleEditComment : handleAddComment}
          />
        )}
      </div>
    </>
  );
}


export default MovieDetailsPage;

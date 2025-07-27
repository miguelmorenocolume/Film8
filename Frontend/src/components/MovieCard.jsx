import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie, isReserved }) => {
  const navigate = useNavigate(); // Hook para navegación

  // Navega a la página de detalles al hacer clic
  const handleClick = () => {
    navigate(`/movies/${movie._id}`);
  };

  return (
    // Clase 'reserved' si la película está reservada
    <div className={`movie-card ${isReserved ? 'reserved' : ''}`} onClick={handleClick}>
      <img 
        // Muestra el póster si hay; si no, uno por defecto
        src={
          movie.poster 
            ? `data:image/jpeg;base64,${movie.poster}`
            : '/default-poster.png'
        } 
        alt={movie.title || movie.name} 
      />
      <div className="movie-info">
        <h4>{movie.title || movie.name}</h4>
        {/* Etiqueta si está reservada */}
        {isReserved && <span className="reserved-label">Reservada</span>}
      </div>
    </div>
  );
};

export default MovieCard;

import React, { useState, useEffect } from 'react';
import './CommentModal.css';

// Componente modal para añadir o editar comentarios
const CommentModal = ({
  initialText = '',
  initialRating = 5,
  onClose,
  onSubmit,
  isEditing = false,
}) => {
  const [text, setText] = useState(initialText);
  const [rating, setRating] = useState(initialRating);
  const [error, setError] = useState('');

  // Actualiza los estados cuando cambian las props iniciales
  useEffect(() => {
    setText(initialText);
    setRating(initialRating);
    setError('');
  }, [initialText, initialRating]);

  // Maneja el envío del comentario
  const handleSubmit = () => {
    if (text.trim() === '') {
      setError('El comentario no puede estar vacío');
      return;
    }

    setError('');
    onSubmit(text, rating);
  };

  return (
    <div className="modal-backdrop">
      <div className="comment-modal">
        {/* Título dinámico según si es edición o nuevo comentario */}
        <h3>{isEditing ? 'Editar comentario' : 'Añadir comentario'}</h3>

        {/* Área de texto para el comentario */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Escribe tu comentario"
        />

        {/* Muestra el error si existe */}
        {error && <p className="error">{error}</p>}

        {/* Slider para la puntuación */}
        <label htmlFor="rating" className="slider-label">
          Puntuación: {rating}
        </label>

        <input
          id="rating"
          type="range"
          min={1}
          max={10}
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
        />

        {/* Botones para guardar/enviar o cancelar */}
        <div className="comment-modal-buttons">
          <button
            className="comment-modal-button-save"
            onClick={handleSubmit}
          >
            {isEditing ? 'Guardar' : 'Enviar'}
          </button>
          <button
            className="comment-modal-button-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;

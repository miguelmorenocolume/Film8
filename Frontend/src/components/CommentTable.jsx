import { useState, useEffect } from 'react';
import API from '../api/axios';
import './DashboardTable.css';

const CommentTable = () => {
  // Estado para almacenar los comentarios
  const [comments, setComments] = useState([]);
  // Estado para manejar errores
  const [error, setError] = useState('');
  // Estado para controlar el id del comentario a eliminar
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Función para obtener los comentarios desde la API
  const fetchComments = async () => {
    try {
      const res = await API.get('/comments');
      setComments(res.data);
    } catch (err) {
      setError('Error cargando comentarios');
      console.error(err);
    }
  };

  // Cargar los comentarios al montar el componente
  useEffect(() => {
    fetchComments();
  }, []);

  // Función para eliminar un comentario
  const handleDelete = async (id) => {
    try {
      await API.delete(`/comments/${id}`);
      setConfirmDeleteId(null);
      fetchComments();
    } catch (err) {
      setError('Error eliminando comentario');
      console.error(err);
    }
  };

  return (
    <div className="table-section">
      {/* Mostrar error si existe */}
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Película</th>
            <th>Texto</th>
            <th>Puntuación</th>
            <th>Editado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Mostrar mensaje si no hay comentarios */}
          {comments.length === 0 && (
            <tr><td colSpan="8">No hay comentarios</td></tr>
          )}
          {/* Renderizar cada comentario */}
          {comments.map((c) => (
            <tr key={c._id}>
              <td>{c.user?.username || 'Desconocido'}</td>
              <td>{c.user?.email || '-'}</td>
              <td>{c.movie?.title || 'Desconocida'}</td>
              <td>{c.text}</td>
              <td>{c.rating}</td>
              <td>{c.edited ? 'Sí' : 'No'}</td>
              <td>{new Date(c.createdAt).toLocaleString()}</td>
              <td>
                {/* Botón para eliminar comentario */}
                <button onClick={() => setConfirmDeleteId(c._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación para eliminar comentario */}
      {confirmDeleteId && (
        <div className="modal-backdrop">
          <div className="modal-content confirm-modal">
            <p>¿Eliminar este comentario?</p>
            <div className="modal-buttons">
              <button onClick={() => handleDelete(confirmDeleteId)}>Sí, eliminar</button>
              <button onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentTable;

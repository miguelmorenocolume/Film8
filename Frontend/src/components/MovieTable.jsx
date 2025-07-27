import { useState, useEffect } from 'react';
import API from '../api/axios';
import './DashboardTable.css';

const MovieTable = () => {
  // Estados para películas, modal, edición, imagen, errores, carga y confirmación de borrado
  const [movies, setMovies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Función para obtener las películas desde la API
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await API.get('/movies');
      setMovies(res.data);
    } catch (err) {
      console.error('Error cargando películas', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar películas al montar el componente
  useEffect(() => {
    fetchMovies();
  }, []);

  // Manejar edición: abre modal con los datos de la película
  const handleEdit = (movie) => {
    setEditMovie(movie);
    setModalOpen(true);
  };

  // Manejar creación: abre modal vacío
  const handleCreate = () => {
    setEditMovie(null);
    setPosterFile(null);
    setModalOpen(true);
  };

  // Manejar eliminación de película
  const handleDelete = async (id) => {
    try {
      await API.delete(`/movies/${id}`);
      setConfirmDeleteId(null);
      fetchMovies();
    } catch (err) {
      console.error('Error eliminando película', err);
    }
  };

  // Convertir archivo a base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Manejar envío del formulario para crear o editar película
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const form = e.target;
    const titleInput = form.title.value.trim();

    // Validar si la película ya existe (solo en creación)
    if (!editMovie) {
      const exists = movies.some(
        (m) => m.title.toLowerCase() === titleInput.toLowerCase()
      );
      if (exists) {
        setError('La película ya existe');
        return;
      }
    }

    // Convertir imagen si se proporciona una nueva
    let base64Poster = editMovie?.poster || '';

    if (posterFile) {
      try {
        base64Poster = await convertToBase64(posterFile);
      } catch (err) {
        setError('Error al convertir imagen');
        return;
      }
    }

    // Construir objeto de datos
    const data = {
      title: titleInput,
      duration: Number(form.duration.value),
      sinopsis: form.sinopsis.value,
      genre: form.genre.value,
      director: form.director.value,
      releaseYear: Number(form.releaseYear.value),
      poster: base64Poster,
    };

    try {
      // Enviar PUT si edita, POST si crea
      if (editMovie) {
        await API.put(`/movies/${editMovie._id}`, data);
      } else {
        await API.post('/movies', data);
      }
      setModalOpen(false);
      fetchMovies();
    } catch (err) {
      setError('Error guardando película');
    }
  };


  return (
    <div className="table-section">
      {/* Botón para crear nueva película */}
      <button className="add-button" onClick={handleCreate}>
        Crear Película
      </button>

      {/* Mensaje de carga o tabla de películas */}
      {loading ? (
        <p style={{ textAlign: 'center', fontWeight: '600', marginTop: '1rem' }}>
          Cargando películas...
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Póster</th>
              <th>Título</th>
              <th>Duración</th>
              <th>Género</th>
              <th>Director</th>
              <th>Año</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Mensaje si no hay películas */}
            {movies.length === 0 && (
              <tr><td colSpan="7">No hay películas</td></tr>
            )}
            {/* Mapeo de películas */}
            {movies.map((m) => (
              <tr key={m._id}>
                <td>
                  {/* Mostrar póster si existe */}
                  {m.poster && (
                    <img
                      src={`data:image/jpeg;base64,${m.poster}`}
                      alt={`Póster de ${m.title}`}
                      style={{ maxHeight: '100px', borderRadius: '5px' }}
                    />
                  )}
                </td>
                <td>{m.title}</td>
                <td>{m.duration} min</td>
                <td>{m.genre}</td>
                <td>{m.director}</td>
                <td>{m.releaseYear}</td>
                <td>
                  {/* Botones de editar y eliminar */}
                  <button onClick={() => handleEdit(m)}>Editar</button>
                  <button onClick={() => setConfirmDeleteId(m._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de confirmación para eliminar */}
      {confirmDeleteId && (
        <div className="modal-backdrop">
          <div className="modal-content confirm-modal">
            <p>¿Estás seguro de que quieres eliminar esta película?</p>
            <div className="modal-buttons">
              <button onClick={() => handleDelete(confirmDeleteId)}>Sí, eliminar</button>
              <button onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear o editar película */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{editMovie ? 'Editar Película' : 'Nueva Película'}</h3>
            {/* Mensaje de error si lo hay */}
            {error && (
              <p style={{ color: 'red', fontWeight: '600', marginBottom: '1rem' }}>
                {error}
              </p>
            )}
            {/* Formulario de película */}
            <form onSubmit={handleSubmit}>
              <label>
                Título:
                <input type="text" name="title" defaultValue={editMovie?.title || ''} required />
              </label>
              <label>
                Sinopsis:
                <textarea name="sinopsis" defaultValue={editMovie?.sinopsis || ''} rows={4} required />
              </label>
              <label>
                Duración (min):
                <input type="number" name="duration" defaultValue={editMovie?.duration || ''} required />
              </label>
              <label>
                Género:
                <input type="text" name="genre" defaultValue={editMovie?.genre || ''} required />
              </label>
              <label>
                Director:
                <input type="text" name="director" defaultValue={editMovie?.director || ''} required />
              </label>
              <label>
                Año de estreno:
                <input type="number" name="releaseYear" defaultValue={editMovie?.releaseYear || ''} required />
              </label>
              <label>
                Póster:
                <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files[0])} />
              </label>
              {/* Botones del formulario */}
              <div className="modal-buttons">
                <button type="submit">Guardar</button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditMovie(null);
                    setError('');
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default MovieTable;

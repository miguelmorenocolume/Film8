import { useState, useEffect } from 'react';
import API from '../api/axios';
import './DashboardTable.css';

const ReservationTable = () => {

    // Estado que almacena todas las reservas obtenidas del backend
    const [reservations, setReservations] = useState([]);

    // Estado que almacena la lista de usuarios disponibles
    const [users, setUsers] = useState([]);

    // Estado que almacena la lista de películas disponibles
    const [movies, setMovies] = useState([]);

    // Estado para mostrar un spinner o mensaje mientras se cargan los datos
    const [loading, setLoading] = useState(true);

    // Estado que controla si el modal de crear/editar está abierto
    const [modalOpen, setModalOpen] = useState(false);

    // Estado que guarda la reserva seleccionada para editarla (null si es nueva)
    const [editReservation, setEditReservation] = useState(null);

    // Estado para mostrar mensajes de error en el formulario del modal
    const [error, setError] = useState('');

    // Estado que guarda el ID de la reserva que se quiere eliminar, para confirmar
    const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Nuevo estado


    // Obtiene reservas, usuarios y películas
    const fetchData = async () => {
        setLoading(true);
        try {
            const [reservationsRes, usersRes, moviesRes] = await Promise.all([
                API.get('/reservations/all'),
                API.get('/auth/users'),
                API.get('/movies'),
            ]);
            setReservations(reservationsRes.data);
            setUsers(usersRes.data);
            setMovies(moviesRes.data);
        } catch (err) {
            console.error('Error cargando datos:', err);
        } finally {
            setLoading(false);
        }
    };

    // Ejecuta fetchData al montar el componente
    useEffect(() => {
        fetchData();
    }, []);

    // Abre el modal para crear una nueva reserva
    const handleCreate = () => {
        setEditReservation(null);
        setError('');
        setModalOpen(true);
    };

    // Abre el modal para editar una reserva existente
    const handleEdit = (reservation) => {
        setEditReservation(reservation);
        setError('');
        setModalOpen(true);
    };

    // Elimina una reserva
    const handleDelete = async (id) => {
        try {
            await API.delete(`/reservations/${id}`);
            setConfirmDeleteId(null);
            fetchData();
        } catch (err) {
            console.error('Error eliminando reserva:', err);
        }
    };

    // Envía el formulario del modal (crear o editar reserva)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const form = e.target;
        const userId = form.user.value.trim();
        const movieId = form.movie.value.trim();
        const expiresAtInput = form.expiresAt.value;

        // Validación de campos
        if (!userId || !movieId || !expiresAtInput) {
            setError('Todos los campos son obligatorios');
            return;
        }

        const expiresAt = new Date(expiresAtInput);
        if (isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
            setError('La fecha de expiración no es válida o ya pasó');
            return;
        }

        // Cuerpo de la reserva
        const data = {
            user: userId,
            movie: movieId,
            expiresAt: expiresAt.toISOString()
        };

        try {
            // Si se edita, elimina y vuelve a crear
            if (editReservation) {
                await API.delete(`/reservations/${editReservation._id}`);
                await API.post('/reservations', data);
            } else {
                await API.post('/reservations', data);
            }
            setModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Error creando reserva:', err);
            const msg = err.response?.data?.message || 'Error guardando reserva';
            setError(msg);
        }
    };

    return (
        <div className="table-section">
            {/* Botón para abrir el modal y crear una nueva reserva */}
            <button className="add-button" onClick={handleCreate}>Crear Reserva</button>

            {/* Mostrar mensaje de carga o mensaje si no hay reservas, o mostrar tabla de reservas */}
            {loading ? (
                <p style={{ textAlign: 'center', fontWeight: '600', marginTop: '1rem' }}>
                    Cargando reservas...
                </p>
            ) : reservations.length === 0 ? (
                <p style={{ textAlign: 'center', fontWeight: '600', marginTop: '1rem' }}>
                    No hay reservas activas.
                </p>
            ) : (
                // Tabla que muestra todas las reservas activas
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Película</th>
                            <th>Reservada desde</th>
                            <th>Expira en</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map(r => (
                            <tr key={r._id}>
                                <td>{r.user?.username || 'Desconocido'}</td>
                                <td>{r.movie?.title || 'Desconocida'}</td>
                                <td>{new Date(r.reservedAt).toLocaleString()}</td>
                                <td>{new Date(r.expiresAt).toLocaleString()}</td>
                                {/* Botones para editar o eliminar la reserva */}
                                <td>
                                    <button onClick={() => handleEdit(r)}>Editar</button>
                                    <button onClick={() => setConfirmDeleteId(r._id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal para crear o editar una reserva */}
            {modalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>{editReservation ? 'Editar Reserva' : 'Nueva Reserva'}</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Selector de usuario */}
                            <label>
                                Usuario:
                                <select name="user" defaultValue={editReservation?.user?._id || ''} required>
                                    <option value="" disabled>Selecciona un usuario</option>
                                    {users.map(u => (
                                        <option key={u._id} value={u._id}>{u.username}</option>
                                    ))}
                                </select>
                            </label>
                            {/* Selector de película */}
                            <label>
                                Película:
                                <select name="movie" defaultValue={editReservation?.movie?._id || ''} required>
                                    <option value="" disabled>Selecciona una película</option>
                                    {movies.map(m => (
                                        <option key={m._id} value={m._id}>{m.title}</option>
                                    ))}
                                </select>
                            </label>
                            {/* Campo para elegir fecha y hora de expiración */}
                            <label>
                                Fecha de expiración:
                                <input
                                    type="datetime-local"
                                    name="expiresAt"
                                    defaultValue={
                                        editReservation
                                            ? new Date(editReservation.expiresAt).toISOString().slice(0, 16)
                                            : ''
                                    }
                                    required
                                />
                            </label>
                            {error && <p className="error">{error}</p>}
                            <div className="modal-buttons">
                                <button type="submit">Guardar</button>
                                <button type="button" onClick={() => setModalOpen(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para eliminar una reserva */}
            {confirmDeleteId && (
                <div className="modal-backdrop">
                    <div className="modal-content confirm-modal">
                        <p>¿Eliminar esta reserva?</p>
                        <div className="modal-buttons">
                            <button onClick={() => handleDelete(confirmDeleteId)}>Sí, eliminar</button>
                            <button onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default ReservationTable;

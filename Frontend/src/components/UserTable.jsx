import { useEffect, useState } from 'react';
import API from '../api/axios';
import './DashboardTable.css';

const UserTable = () => {

  // Estado para almacenar la lista de usuarios
  const [users, setUsers] = useState([]);

  // Estado para controlar si el modal está abierto o cerrado
  const [modalOpen, setModalOpen] = useState(false);

  // Estado para almacenar el usuario que se está editando
  const [editUser, setEditUser] = useState(null);

  // Estado para guardar el ID del usuario que se quiere eliminar (confirmación)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Estado para guardar mensajes de error y mostrarlos en la UI
  const [errorMessage, setErrorMessage] = useState('');


  // Obtener usuarios del backend
  const fetchUsers = async () => {
    try {
      const res = await API.get('/auth/users');
      setUsers(res.data);
    } catch {
      setErrorMessage('Error cargando usuarios.');
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Eliminar un usuario por ID
  const handleDelete = async (id) => {
    try {
      if (!id) return;
      await API.delete(`/auth/users/${id}`);
      setConfirmDeleteId(null);
      fetchUsers();
    } catch {
      setErrorMessage('Error eliminando usuario.');
    }
  };

  // Crear o editar un usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // limpiar error previo

    const form = e.target;
    const data = {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      isAdmin: form.isAdmin.checked,
    };
    if (!editUser) {
      data.password = form.password.value;
    }

    try {
      if (editUser) {
        await API.put(`/auth/users/${editUser._id}`, data);
      } else {
        await API.post('/auth/users', data);
      }
      setModalOpen(false);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrorMessage('El usuario ya existe.');
      } else {
        setErrorMessage('Error guardando usuario.');
      }
    }
  };

  // Filtrar usuarios por rol
  const admins = users.filter(user => user.isAdmin);
  const normales = users.filter(user => !user.isAdmin);

  return (
    <div className="table-section">
      {/* Botón para abrir modal de creación de usuario */}
      <button className="add-button" onClick={() => { setEditUser(null); setModalOpen(true); setErrorMessage(''); }}>
        Crear Usuario
      </button>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Encabezado para administradores */}
          <tr><td colSpan="4" className="group-header">Administradores</td></tr>
          {/* Listado de usuarios administradores */}
          {admins.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>✔️</td>
              <td>
                {/* Botón para editar usuario */}
                <button onClick={() => { setEditUser(user); setModalOpen(true); setErrorMessage(''); }}>Editar</button>
                {/* Botón para confirmar eliminación */}
                <button onClick={() => setConfirmDeleteId(user._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {/* Encabezado para usuarios normales */}
          <tr><td colSpan="4" className="group-header">Usuarios Normales</td></tr>
          {/* Listado de usuarios normales */}
          {normales.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td></td>
              <td>
                {/* Botón para editar usuario */}
                <button onClick={() => { setEditUser(user); setModalOpen(true); setErrorMessage(''); }}>Editar</button>
                {/* Botón para confirmar eliminación */}
                <button onClick={() => setConfirmDeleteId(user._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación para eliminar usuario */}
      {confirmDeleteId && (
        <div className="modal-backdrop">
          <div className="modal-content confirm-modal">
            <p>¿Estás seguro de que quieres eliminar este usuario?</p>
            <div className="modal-buttons">
              <button onClick={() => handleDelete(confirmDeleteId)}>Sí, eliminar</button>
              <button onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear o editar usuario */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{editUser ? 'Editar Usuario' : 'Crear Usuario'}</h3>

            <form onSubmit={handleSubmit}>
              {/* Mostrar mensaje de error si existe */}
              {errorMessage && (
                <p style={{ color: 'red', fontWeight: '600', marginBottom: '1rem' }}>
                  {errorMessage}
                </p>
              )}

              <label>
                Nombre:
                <input
                  type="text"
                  name="username"
                  defaultValue={editUser?.username || ''}
                  required
                  minLength={3}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  defaultValue={editUser?.email || ''}
                  required
                />
              </label>
              {/* Mostrar campo contraseña solo al crear usuario */}
              {!editUser && (
                <label>
                  Contraseña:
                  <input type="password" name="password" required minLength={6} />
                </label>
              )}
              <label>
                <input
                  type="checkbox"
                  name="isAdmin"
                  defaultChecked={editUser?.isAdmin || false}
                />
                ¿Es administrador?
              </label>

              <div className="modal-buttons">
                <button type="submit">Guardar</button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditUser(null);
                    setErrorMessage('');
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

  export default UserTable;

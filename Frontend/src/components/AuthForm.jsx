// src/components/AuthForm.jsx
import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

const AuthForm = ({ mode = 'login' }) => {
  // Estados para los campos del formulario y errores
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { setUser, setToken } = useAuth();

  // Determina si el modo es login o registro
  const isLogin = mode === 'login';

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Define la URL y el cuerpo según el modo
      const url = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { email, password } : { username, email, password };
      const res = await api.post(url, body);

      // Guarda el usuario y el token en el contexto
      setUser(res.data.user || res.data);
      setToken(res.data.token);
    } catch (err) {
      // Muestra el error si ocurre
      setError(err.response?.data?.message || 'Error en la autenticación');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {/* Campo de nombre de usuario solo en modo registro */}
      {!isLogin && (
        <div className="form-group">
          <label>Nombre de usuario</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
      )}

      {/* Campo de email */}
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Campo de contraseña */}
      <div className="form-group">
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Mensaje de error si existe */}
      {error && <p className="error">{error}</p>}

      {/* Botón de envío */}
      <button type="submit" className="btn-submit">
        {isLogin ? 'Iniciar sesión' : 'Registrarse'}
      </button>
    </form>
  );
};

export default AuthForm;

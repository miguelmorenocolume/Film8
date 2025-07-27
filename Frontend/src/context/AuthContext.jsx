import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {

  // Estado para el usuario autenticado
  const [user, setUser] = useState(null);

  // Estado para el token JWT
  const [token, setToken] = useState(null);

  // Estado para indicar si está cargando
  const [loading, setLoading] = useState(true);

  // Al montar el componente, intenta cargar el token y validar el usuario
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    // Si hay token, valida y obtiene el usuario desde el backend
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setUser(res.data);
        setToken(storedToken);
      } catch (error) {
        console.error('Token inválido o expirado', error);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Guarda el token en localStorage cuando cambie
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  // Guarda el usuario en localStorage para persistencia (opcional)
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  // Provee el contexto a los hijos
  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

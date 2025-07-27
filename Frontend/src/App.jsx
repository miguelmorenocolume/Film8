import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import LoginPage from './pages/LoginPage.jsx';
import Home from './pages/Home.jsx';
import MovieDetailsPage from './pages/MovieDetailsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

const App = () => {
  // Obtiene el usuario y el estado de carga desde el contexto de autenticación
  const { user, loading } = useAuth();

  // Muestra una barra de carga mientras se verifica la autenticación
  if (loading) return (
    <div className="loading-container">
      <div className="loading-bar"></div>
    </div>
  );

  // Componente para proteger rutas que requieren autenticación
  const RequireAuth = ({ children }) => {
    if (!user) {
      // Si no hay usuario, redirige al login
      return <Navigate to="/" replace />;
    }
    return children;
  };

  // Componente para proteger rutas solo para administradores
  const RequireAdmin = ({ children }) => {
    if (!user || !user.isAdmin) {
      // Si no es admin, redirige al login
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial: muestra login si no hay usuario, si hay usuario redirige a /home */}
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <LoginPage />}
        />

        {/* Rutas protegidas para usuarios autenticados */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/movies/:id"
          element={
            <RequireAuth>
              <MovieDetailsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        {/* Ruta protegida solo para administradores */}
        <Route
          path="/dashboard"
          element={
            <RequireAdmin>
              <DashboardPage />
            </RequireAdmin>
          }
        />

        {/* Ruta comodín: redirige según si el usuario está autenticado */}
        <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

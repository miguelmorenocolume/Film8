import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MenuIcon from '../assets/menu.svg';
import CloseIcon from '../assets/close.svg';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  // Hook para navegación
  const navigate = useNavigate();
  // Estado para el menú móvil
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Logo oculto en móvil */}
        <Link to="/" className="navbar-logo">Film8</Link>
      </div>

      {user && (
        <>
          {/* Botón menú con iconos svg */}
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            <img src={menuOpen ? CloseIcon : MenuIcon} alt={menuOpen ? 'Cerrar menú' : 'Abrir menú'} />
          </button>

          {/* Menú de navegación */}
          <div className={`navbar-right ${menuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Películas</Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>Perfil</Link>
            {/* Enlace al dashboard si es admin */}
            {user.isAdmin && <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
            {/* Botón para cerrar sesión */}
            <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="btn-logout">
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import UserTable from '../components/UserTable';
import MovieTable from '../components/MovieTable';
import CommentTable from '../components/CommentTable';
import ReservationTable from '../components/ReservationTable';
import './DashboardPage.css';

const DashboardPage = () => {
  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState('usuarios');

  // Renderiza el contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'usuarios':
        return <UserTable />;
      case 'peliculas':
        return <MovieTable />;
      case 'comentarios':
        return <CommentTable />;
      case 'reservas':
        return <ReservationTable />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Barra de navegación */}
      <Navbar />
      <div className="dashboard-container">
        <h1>Panel de Control</h1>
        {/* Mensaje sobre uso recomendado en escritorio */}
        <div className='access-message'>El uso del Panel de Administrador está diseñado para dispositivos de escritorio. Para una navegación adecuada, por favor utilice un equipo de sobremesa o portátil. </div>

        {/* Botones para cambiar pestañas */}
        <div className="tab-buttons">
          <button
            className={activeTab === 'usuarios' ? 'active' : ''}
            onClick={() => setActiveTab('usuarios')}
          >
            Usuarios
          </button>
          <button
            className={activeTab === 'peliculas' ? 'active' : ''}
            onClick={() => setActiveTab('peliculas')}
          >
            Películas
          </button>
          <button
            className={activeTab === 'comentarios' ? 'active' : ''}
            onClick={() => setActiveTab('comentarios')}
          >
            Comentarios
          </button>
          <button
            className={activeTab === 'reservas' ? 'active' : ''}
            onClick={() => setActiveTab('reservas')}
          >
            Reservas
          </button>
        </div>

        {/* Área donde se muestra el contenido de la pestaña seleccionada */}
        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

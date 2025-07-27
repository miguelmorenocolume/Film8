import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios.jsx';
import MovieCard from '../components/MovieCard.jsx';
import Navbar from '../components/Navbar.jsx';
import './Home.css';

const Home = () => {

  // Estado para almacenar la lista de películas
  const [movies, setMovies] = useState([]);

  // Estado para almacenar las reservas realizadas
  const [reservations, setReservations] = useState([]);

  // Estado para almacenar los datos del usuario actual
  const [user, setUser] = useState(null);

  // Estado para indicar si los datos están cargando
  const [loading, setLoading] = useState(true);

  // Estado para almacenar el término de búsqueda actual
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para almacenar el término de búsqueda con debounce aplicado
  const [debouncedSearch, setDebouncedSearch] = useState('');


  // Cargar usuario, películas y reservas al montar componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);

        const moviesRes = await api.get('/movies');
        setMovies(moviesRes.data);

        const reservationsRes = await api.get('/reservations');
        setReservations(reservationsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Actualizar búsqueda con debounce de 500ms tras última pulsación
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filtrar películas por título, director o género con búsqueda debounced
  const filteredMovies = useMemo(() => {
    if (!debouncedSearch) return movies;
    return movies.filter(({ title, director, genre }) => {
      const text = `${title} ${director} ${genre}`.toLowerCase();
      return text.includes(debouncedSearch);
    });
  }, [debouncedSearch, movies]);

  // Comprobar si una película está reservada
  const isReserved = (movieId) => {
    return reservations.some(r => r.movie === movieId);
  };

  // Mostrar loading mientras carga datos
  if (loading) return (
    <div className="loading-container">
      <p>
        Bienvenido,{user?.username && (
          <span className="red-name"> {user.username}</span>
        )}
      </p>

      <div className="loading-bar"></div>
    </div>
  );

  // Render principal: Navbar, input de búsqueda y lista de películas filtradas
  return (
    <>
      <Navbar />
      <div className="home-page">
        <input
          type="search"
          className="search-input"
          placeholder="Buscar por título, director o género..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          autoFocus
        />

        <div className="movie-list">
          {filteredMovies.length === 0 ? (
            <p>No se encontraron películas que coincidan con tu búsqueda.</p>
          ) : (
            filteredMovies.map(movie => (
              <MovieCard key={movie._id} movie={movie} isReserved={isReserved(movie._id)} />
            ))
          )}
        </div>
      </div>
      <br />
    </>
  );
};

export default Home;

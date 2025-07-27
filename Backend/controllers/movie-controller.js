import Movie from '../models/Movie.js';


// Crear una nueva película (solo administradores)
export const createMovie = async (req, res) => {
  try {
    const {
      title,
      duration,
      genre,
      director,
      releaseYear,
      poster,
      posterMimeType,
      sinopsis
    } = req.body;

    // Crea la película en la base de datos
    const movie = await Movie.create({
      title,
      duration,
      genre,
      director,
      releaseYear,
      poster,
      posterMimeType,
      sinopsis,
    });

    // Añade la URL de imagen codificada para el frontend
    const movieWithPosterUrl = {
      ...movie.toObject(),
      posterUrl: poster && posterMimeType
        ? `data:${posterMimeType};base64,${poster}`
        : null,
    };

    res.status(201).json(movieWithPosterUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las películas (público)
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();

    // Transforma cada película con su imagen codificada
    const moviesWithPosterUrl = movies.map(movie => ({
      ...movie.toObject(),
      posterUrl: movie.poster && movie.posterMimeType
        ? `data:${movie.posterMimeType};base64,${movie.poster}`
        : null,
    }));

    res.json(moviesWithPosterUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener los detalles de una película por su ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    // Incluye la URL de imagen para mostrar en el frontend
    const movieWithPosterUrl = {
      ...movie.toObject(),
      posterUrl: movie.poster && movie.posterMimeType
        ? `data:${movie.posterMimeType};base64,${movie.poster}`
        : null,
    };

    res.json(movieWithPosterUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar los datos de una película (solo admins)
export const updateMovie = async (req, res) => {
  try {
    const {
      title,
      duration,
      genre,
      director,
      releaseYear,
      poster,
      posterMimeType,
      sinopsis
    } = req.body;

    const updateFields = {
      title,
      duration,
      genre,
      director,
      releaseYear,
      sinopsis,
    };

    // Solo actualiza la imagen si se envía una nueva
    if (poster && posterMimeType) {
      updateFields.poster = poster;
      updateFields.posterMimeType = posterMimeType;
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    const movieWithPosterUrl = {
      ...movie.toObject(),
      posterUrl: movie.poster && movie.posterMimeType
        ? `data:${movie.posterMimeType};base64,${movie.poster}`
        : null,
    };

    res.json(movieWithPosterUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una película por su ID (solo admins)
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }
    res.json({ message: 'Película eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

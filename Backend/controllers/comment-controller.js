import Comment from '../models/Comment.js';

// Crear comentario (usuarios logueados)
export const createComment = async (req, res) => {
  const { movie, text, rating } = req.body;
  const user = req.user._id;

  // Verifica que no falten campos
  if (!movie || !text || rating == null) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    // Crea el comentario
    const comment = await Comment.create({
      user,
      movie,
      text,
      rating,
      edited: false,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Editar comentario (solo autor)
export const updateComment = async (req, res) => {
  const commentId = req.params.id;
  const { text, rating } = req.body;
  const user = req.user;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

    // Verifica que el usuario sea el autor del comentario
    if (comment.user.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para editar este comentario' });
    }

    // Actualiza los campos editables
    if (text) comment.text = text;
    if (rating != null) comment.rating = rating;
    comment.edited = true;

    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar comentario (admin o autor)
export const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const user = req.user;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

    // Solo el autor o un admin puede borrarlo
    if (comment.user.toString() !== user._id.toString() && !user.isAdmin) {
      return res.status(403).json({ message: 'No autorizado para eliminar este comentario' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener comentarios de una película
export const getCommentsByMovie = async (req, res) => {
  const movieId = req.params.movieId;

  try {
    // Busca comentarios por ID de película, ordenados por fecha
    const comments = await Comment.find({ movie: movieId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los comentarios (solo admin)
export const getAllComments = async (req, res) => {
  try {
    // Devuelve todos los comentarios con info de usuario y película
    const comments = await Comment.find()
      .populate('user', 'username email')
      .populate('movie', 'title');

    res.json(comments);
  } catch (error) {
    console.error('Error getAllComments:', error);
    res.status(500).json({ message: 'Error al obtener comentarios' });
  }
};

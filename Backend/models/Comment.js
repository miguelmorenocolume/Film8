import mongoose from 'mongoose';

// Esquema de Comentario
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  edited: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;

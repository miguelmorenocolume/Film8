import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import Comment from '../models/Comment.js';
import Reservation from '../models/Reservation.js';

// Registro de usuarios normales
export const registerUser = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  // Validación de campos obligatorios
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos' });
  }

  try {
    // Comprobación de usuario existente
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Solo un admin logueado con token puede crear otro admin
    if (isAdmin === true && (!req.user || !req.user.isAdmin)) {
      return res.status(403).json({ message: 'No autorizado para crear un usuario administrador' });
    }

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password,
      isAdmin: isAdmin === true && req.user?.isAdmin === true,
    });

    // Respuesta con token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validación
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña requeridos' });
  }

  try {
    // Buscar usuario por email
    const user = await User.findOne({ email });

    // Verificar contraseña
    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        token: generateToken(user._id, user.isAdmin),
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los usuarios (solo para administradores)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear usuario como admin (tanto admin como usuario normal)
export const createUserByAdmin = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  // Validación
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const user = await User.create({ username, email, password, isAdmin: !!isAdmin });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar usuario por ID (solo admins)
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { username, email, isAdmin } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Actualizar campos si vienen en la petición
    user.username = username || user.username;
    user.email = email || user.email;
    if (typeof isAdmin === 'boolean') user.isAdmin = isAdmin;

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar usuario (solo admins)
export const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Evitar que un admin se borre a sí mismo
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });
    }

    // Eliminar comentarios y reservas asociados al usuario
    await Comment.deleteMany({ user: id });
    await Reservation.deleteMany({ user: id });

    // Eliminar el usuario
    await user.deleteOne();

    res.json({ message: 'Usuario, comentarios y reservas eliminados correctamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      message: 'Error interno al eliminar usuario',
      error: error.message,
    });
  }
};

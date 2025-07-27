import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); 


// Conexión a la base de datos MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;

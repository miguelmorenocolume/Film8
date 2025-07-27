import { useState } from 'react';
import AuthForm from '../components/AuthForm.jsx';
import './LoginPage.css';

const LoginPage = () => {
  // Estado para controlar si se muestra el formulario de login o registro
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-page">
      {/* Título dinámico según modo */}
      <h1>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h1>

      {/* Formulario de autenticación con modo dinámico */}
      <AuthForm mode={isLogin ? 'login' : 'register'} />

      {/* Botón para alternar entre login y registro */}
      <button
        className="toggle-btn-login"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
};

export default LoginPage;

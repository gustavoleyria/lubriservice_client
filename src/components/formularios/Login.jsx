import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../utils/UserContexy';
const LOG = import.meta.env.VITE_REACT_APP_ULOG;
const PAS = import.meta.env.VITE_REACT_APP_URPA;

const Login = () => {
  //const { setIsUserLoggedIn } = useContext(UserContext); // Obtener el estado del usuario del contexto
  const {  setIsUserLoggedIn, setToken, setUserId  } = useContext(UserContext); // Obtener la función para actualizar el usuario del contexto
  const navigate = useNavigate(); // Obtener la función de navegación

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${LOG}`, {
        email,
        password,
      });

      console.log('Inicio de sesión exitoso:', response.data.message);
      console.log(response);
      const { token, id } = response.data; // Obtener el token y el ID de usuario de la respuesta
      setIsUserLoggedIn(true); // Establecer el estado del usuario como registrado
      setToken(token); // Actualizar el token en el contexto
      setUserId(id); // Actualizar el ID de usuario en el contexto
      
      // Resto del código...
      navigate('/home');
      console.log('Estado isUserLoggedIn actualizado a true');
       // Añade estos console.log
       console.log('Token:', token);
       console.log('UserID:', id);
       console.log('isUserLoggedIn:', true);
    } catch (error) {
      console.log('Error al iniciar sesión:', error);
      setError(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  const isEmailValid = (email) => {
    // Expresión regular para validar el formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    try {
      if(!email){
        return alert("Por favor llenar la casilla de email")
      }
      const mail = isEmailValid(email);
      if(!mail){
        return alert("No es una dirección de mail")
      }
      console.log(email)
      const response = await axios.patch(`${PAS}`, {
        email
      });

      console.log('Inicio de sesión exitoso:', response.data.message);
      console.log(response);
      
      // Resto del código...
      return alert(response.data.message)
    } catch (error) {
      console.log('Error al resetear password', error);
      alert(error.response.data.error);
    }
  };

  

  if (error) {
    alert(error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-slate-300 p-6 rounded-lg shadow-md sm:mt-0 -mt-96">
    
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Formulario de Inicio de Sesión
        </h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recordar
              </label>
            </div> */}

            <div className="text-sm">
              <button
                onClick={resetPassword}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                ¿Olvidé Contraseña?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

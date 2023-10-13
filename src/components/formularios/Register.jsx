import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../utils/UserContexy';

//URL
const REG = import.meta.env.VITE_REACT_APP_UREG;

const FormRegister = () => {
  const { setIsUserLoggedIn, setToken, setUserId  } = useContext(UserContext); // Obtener el estado del usuario del contexto
  const navigate = useNavigate(); // Obtener la función de navegación

  const [email, setEmail] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [active, setActive] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${REG}`, {
        email,
        cellphone,
        password,
        role,
        active: true
      });

      console.log('Usuario registrado correctamente:', response.data.message);
      const { token, userId } = response.data; // Obtener el token y el ID de usuario de la respuesta
      setIsUserLoggedIn(true); // Establecer el estado del usuario como registrado
      setToken(token); // Actualizar el token en el contexto
      setUserId(userId); // Actualizar el ID de usuario en el contexto
      // Redireccionar al usuario a la ruta "/recomendaciones"
      navigate('/home');
      console.log('Estado isUserLoggedIn actualizado a true');
    } catch (error) {
      console.log('Error al registrar el usuario:', error.message);
      // Mostrar el mensaje de error en un alert
      setError(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-slate-300 p-6 rounded-lg shadow-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Formulario de Registro</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>   
            <div>
              <label htmlFor="cellphone" className="sr-only">Celular:</label>
              <input
                type="text"
                id="cellphone"
                name="cellphone"
                value={cellphone}
                onChange={(e) => setCellphone(e.target.value)}
                required
                placeholder="Celular"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div> 
            <div>
              <label htmlFor="password" className="sr-only">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="min 5 max 10 num && a && A"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>   
            <div>
              <label htmlFor="role" className="sr-only">Rol:</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="">Seleccionar rol</option>
                <option value="MANAGER">MANAGER</option>
                <option value="OPERADOR">OPERADOR</option>
                <option value="CLIENTE">CLIENTE</option>
                <option value="MECANICO">MECANICO</option>
              </select>
            </div>   
          </div>
          <div>
            <button type="submit" 
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Registrarse
            </button>
          </div>
          
        </form>
      </div>
    </div>
    
  );
};

export default FormRegister;

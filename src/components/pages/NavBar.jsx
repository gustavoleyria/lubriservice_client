import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import { UserContext } from '../utils/UserContexy';
import axios from 'axios'; // Asegúrate de importar axios

//URL
const ROLE = import.meta.env.VITE_REACT_APP_UGRO;

const NavBar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userId, token } = useContext(UserContext); // Obtén el token del contexto
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Realizar la solicitud para obtener el rol del usuario
    axios
      .get(`${ROLE}${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        const role = response.data;

        // Verificar si el rol es "MANAGER" o "OPERADOR"
        if (role) {
          setUserRole(role);
        }
      })
      .catch((error) => {
        console.error('Error al obtener el rol del usuario:', error);
      });
  }, [userId, token]); // Asegúrate de incluir userId y token como dependencias

  
  // Definir las opciones de navegación según el rol del usuario
  const navigationOptions = [
    { label: 'Home', link: '/home' },
    { label: 'Promociones', link: '/promociones' },
    { label: 'Ingreso', link: '/ingreso' },
    { label: 'Seguimiento', link: '/seguimiento' },
  ];

  // Agregar opciones adicionales para roles 'MANAGER' y 'OPERADOR'
  if (userRole === 'MANAGER' || userRole === 'OPERADOR') {
    navigationOptions.push(
      { label: 'Garage', link: '/garage' },
      { label: 'Facturas', link: '/facturas' }
    );
  } else if (userRole === 'MECANICO') {
    navigationOptions.push({ label: 'Garage', link: '/garage' });
  }

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw7Zjw9Z_LJarEXbN2gc0XGmBS_eFXnKpLuOVmVGodEg&s" 
            alt="Logo de la empresa" 
            className="w-12 h-12 rounded-full"
          />
        </div>

        {/* Menú de navegación */}
        <div className="hidden md:flex space-x-4">
          {navigationOptions.map((option) => (
            <Link // Utiliza Link en lugar de 'a'
              key={option.link}
              to={option.link} // Utiliza 'to' en lugar de 'href'
              className="text-white hover:underline font-semibold text-lg"
            >
              {option.label}
            </Link>
          ))}
        </div>

        {/* Menú hamburguesa para dispositivos móviles */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none text-4xl"
          >
            ☰
          </button>
        </div>

        {/* Menú desplegable para dispositivos móviles */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full">
            <div className="bg-blue-500 p-2 ml-1 mr-1 mt-1">
              <ul className="text-white p-4 text-left font-bold">
                {navigationOptions.map((option) => (
                  <li key={option.link} className="mb-2">
                    <Link // Utiliza Link en lugar de 'a'
                      to={option.link} // Utiliza 'to' en lugar de 'href'
                      className="text-white hover:underline pl-2 pr-2"
                    >
                      {option.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;


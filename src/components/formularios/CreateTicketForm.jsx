import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../utils/UserContexy';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//URL
const ROLE = import.meta.env.VITE_REACT_APP_UGRO;
const TRABAJOS = import.meta.env.VITE_REACT_APP_TRGT;
const TRABAJADORES = import.meta.env.VITE_REACT_APP_TAGT;
const GETCAR = import.meta.env.VITE_REACT_APP_CAGC;
const CREATEORDER = import.meta.env.VITE_REACT_APP_TKTG;

const CreateTicketForm = () => {
  const { token, userId, isUserLoggedIn } = useContext(UserContext);
  const [patente, setPatente] = useState(''); // Inicialmente, establece patente en una cadena vacía
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    carId: '',
    observacionRecepcion: '',
    trabajoId: [],
    trabajadorId: [],
    km: 0,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [trabajos, setTrabajos] = useState([]); // Estado para almacenar los trabajos disponibles
  const [trabajadores, setTrabajadores] = useState([]); // Estado para almacenar los trabajadores disponibles

  useEffect(() => {
    // Verificar si el usuario está logueado
    if (!isUserLoggedIn) {
      navigate('/ingreso');
    } else {
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
          if (role !== 'MANAGER' && role !== 'OPERADOR') {
            alert('No tiene los permisos necesarios.');
            navigate('/home');
          }
        })
        .catch((error) => {
          console.error('Error al obtener el rol del usuario:', error);
          alert('Ocurrió un error al obtener el rol del usuario.');
          navigate('/ingreso');
        });

      // Realizar solicitud para obtener trabajos disponibles
      axios
        .get(`${TRABAJOS}${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          const trabajosData = response.data.trabajos;

          // Actualizar el estado con los trabajos disponibles
          setTrabajos(trabajosData);
        })
        .catch((error) => {
          console.error('Error al obtener los trabajos:', error);
          alert('Ocurrió un error al obtener los trabajos.');
        });

      // Realizar solicitud para obtener trabajadores disponibles
      axios
        .get(`${TRABAJADORES}${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          const trabajadoresData = response.data.trabajadores
          ;

          // Actualizar el estado con los trabajadores disponibles
          setTrabajadores(trabajadoresData);
        })
        .catch((error) => {
          console.error('Error al obtener los trabajadores:', error);
          alert('Ocurrió un error al obtener los trabajadores.');
        });
    }
  }, [isUserLoggedIn, navigate, token, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Aquí, si el campo es "carId" (patente), actualiza el estado patente
    if (name === 'carId') {
      setPatente(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleTrabajoChange = (e) => {
    // Obtener los valores seleccionados en el campo de trabajoId
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      option.value
    );

    setFormData({ ...formData, trabajoId: selectedOptions });
  };

  const handleTrabajadorChange = (e) => {
    // Obtener los valores seleccionados en el campo de trabajadorId
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      option.value
    );

    setFormData({ ...formData, trabajadorId: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Realiza la solicitud para obtener el ID del automóvil
    try {
      const response = await axios.get(`${GETCAR}${userId}/${patente}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      console.log(response);
  
      const carId = response.data.car[0]._id; // Obtiene el ID del automóvil
      console.log(carId)
      console.log(formData)
  
      // Crea el ticket utilizando el ID del automóvil
      await axios.post(
        `${CREATEORDER}${userId}`,
        { ...formData, carId },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log(formData)
      
  
      setSuccess(true);
      setError(null);
      navigate('/garage'); // Redirige a la página de Garage
    } catch (error) {
      setSuccess(false);
      setError(error.message || 'Hubo un error al crear el ticket.');
    }
  };
  

  return (
    <div className='mt-20'>
      <h2 className="text-2xl font-semibold mb-4">Crear Orden</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          La orden se ha creado exitosamente.
        </div>
      )}
      <form onSubmit={handleSubmit} className='mb-16'>
        <div className="mb-4">
          <label htmlFor="carId" className="block mb-2">Patente:</label>
          <input
            type="text"
            id="carId"
            name="carId"
            value={patente} // Vincula el valor al estado patente
            onChange={(e) => setPatente(e.target.value)} // Maneja el cambio del estado patente
            placeholder="Patente"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="observacionRecepcion" className="block mb-2">Observación de Recepción:</label>
          <textarea
            id="observacionRecepcion"
            name="observacionRecepcion"
            value={formData.observacionRecepcion}
            onChange={handleChange}
            placeholder="Observación de Recepción (máximo 300 caracteres)"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            maxLength="300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="km" className="block mb-2">Kilómetros:</label>
          <input
            type="number"
            id="km"
            name="km"
            value={formData.km}
            onChange={handleChange}
            placeholder="Kilómetros"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="trabajoId" className="block mb-2">Selecciona Trabajo(s):</label>
          <select
            id="trabajoId"
            name="trabajoId"
            multiple
            value={formData.trabajoId}
            onChange={handleTrabajoChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            {trabajos.map((trabajo) => (
              <option key={trabajo._id} value={trabajo._id}>
                {trabajo.detalle}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="trabajadorId" className="block mb-2">Selecciona Trabajador(es):</label>
          <select
            id="trabajadorId"
            name="trabajadorId"
            multiple
            value={formData.trabajadorId}
            onChange={handleTrabajadorChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            {trabajadores.map((trabajador) => (
              <option key={trabajador._id} value={trabajador._id}>
                {`${trabajador.nombre} ${trabajador.apellido}`}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Crear Orden
        </button>
      </form>
    </div>
  );
};

export default CreateTicketForm;

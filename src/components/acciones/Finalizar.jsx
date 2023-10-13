import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../utils/UserContexy';

//URL
const TICKETS = import.meta.env.VITE_REACT_APP_TKGO;
const TRABAJOS = import.meta.env.VITE_REACT_APP_TRGT;
const TRABAJADORES = import.meta.env.VITE_REACT_APP_TAGT;
const TERMINARTICKET = import.meta.env.VITE_REACT_APP_TKTK;

const Finalizar = () => {
  const { token, userId, isUserLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const { orden } = useParams();
  const [detalleOrden, setDetalleOrden] = useState(null);
  const [trabajoData, setTrabajoData] = useState([]);
  const [trabajadorData, setTrabajadorData] = useState([]);

  useEffect(() => {
    // Realizar la solicitud para obtener los detalles de la orden y otros datos necesarios
    axios
      .all([
        axios.get(`${TICKETS}${orden}`),
        axios.get(`${TRABAJOS}${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
        axios.get(`${TRABAJADORES}${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      ])
      .then(
        axios.spread((detalleOrdenResponse, trabajosResponse, trabajadoresResponse) => {
          const detalleData = detalleOrdenResponse.data.ticket;
          const trabajosData = trabajosResponse.data.trabajos;
          const trabajadoresData = trabajadoresResponse.data.trabajadores;

          setDetalleOrden(detalleData);
          setTrabajoData(trabajosData);
          setTrabajadorData(trabajadoresData);
        })
      )
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
        // Manejo de errores: Puedes mostrar un mensaje de error en la interfaz de usuario.
      });
  }, [orden, userId, token]);

  const finalizarOrden = () => {
    // Configura los datos para la solicitud, incluyendo el token en el encabezado
    const config = {
      headers: {
        Authorization: token, // Agrega el token al encabezado
      },
    };
  
    // Realiza la solicitud POST para finalizar la orden
    axios
      .patch(
        `${TERMINARTICKET}${userId}/${orden}`,
        null,
        config // Pasa la configuración que incluye el token
      )
      .then((response) => {
        // Manejo de éxito: Muestra un alert y redirige a la ruta /garage
        console.log(response)
        if(response.data.estado){
          alert(`La orden ${detalleOrden.orden} ha sido finalizada.`);
          navigate('/garage'); // Usamos navigate para redirigir
        }else{
          alert(`La orden ${detalleOrden.orden} ha sido reaperturada.`);
          navigate('/garage'); // Usamos navigate para redirigir
        }
        
      })
      .catch((error) => {
        console.error('Error al finalizar la orden:', error);
        // Manejo de errores: Muestra un alert con el mensaje de error
        alert('Hubo un error al finalizar la orden. Por favor, inténtalo nuevamente.');
      });
  };
  

  const getTrabajoDetails = (trabajoId) => {
    const trabajo = trabajoData.find((item) => item._id === trabajoId);
    return trabajo ? `${trabajo.trabajo} - ${trabajo.detalle}` : 'No encontrado';
  };

  const getTrabajadorDetails = (trabajadorId) => {
    const trabajador = trabajadorData.find((item) => item._id === trabajadorId);
    return trabajador
      ? `${trabajador.nombre} ${trabajador.apellido} - ${trabajador.especialidad}`
      : 'No encontrado';
  };

  return (
    <div className='mb-20'>
      <h2 className='mt-20 font-bold'>Detalles de la Orden</h2>
      {detalleOrden ? (
        <div>
            <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                    <tr className="border-b border-gray-300">
                        <td className="py-2 px-4 font-semibold text-gray-700">Concepto</td>
                        <td className="py-2 px-4 font-semibold text-gray-700">Detalle</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="py-2 px-4">Orden</td>
                        <td className="py-2 px-4">{detalleOrden.orden}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="py-2 px-4">Observación de Recepción</td>
                        <td className="py-2 px-4">{detalleOrden.observacionRecepcion}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="py-2 px-4">Terminado</td>
                        <td className="py-2 px-4">{detalleOrden.terminado ? 'Sí' : 'No'}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="py-2 px-4">Trabajos</td>
                        <td className="py-2 px-4">
                            <ul>
                                {detalleOrden.trabajoId.map((trabajoId) => (
                                <li key={trabajoId}>{getTrabajoDetails(trabajoId)}</li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="py-2 px-4">Trabajadores</td>
                        <td className="py-2 px-4">
                            <ul>
                                {detalleOrden.trabajadorId.map((trabajadorId) => (
                                <li key={trabajadorId}>{getTrabajadorDetails(trabajadorId)}</li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="py-2 px-4">Creado en</td>
                        <td className="py-2 px-4">{new Date(detalleOrden.createdAt).toLocaleDateString()}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="py-2 px-4">Actualizado en</td>
                        <td className="py-2 px-4">{new Date(detalleOrden.updatedAt).toLocaleDateString()}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="py-2 px-4">Facturado</td>
                        <td className="py-2 px-4">{detalleOrden.facturado ? 'Sí' : 'No'}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                        <td className="py-2 px-4">Kilómetros</td>
                        <td className="py-2 px-4">{detalleOrden.km}</td>
                    </tr>
                </tbody>
            </table>
        <button
          onClick={finalizarOrden}
          className="mt-4 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md"
        >
          Finalizar
        </button>
        </div>
      
      ) : (
        <p>Cargando detalles de la orden...</p>
      )}
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white hover:bg-blue-600 rounded-md"
      >
        <Link to={`/detalleOrden/${orden}`}>Ver Trabajos</Link>
      </button>
      
    </div>
  );
};

export default Finalizar;

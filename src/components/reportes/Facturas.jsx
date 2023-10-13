import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../utils/UserContexy';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'; // Importa la función de formato de fecha
import { es } from 'date-fns/locale';

//URL
const FACTURAS = import.meta.env.VITE_REACT_APP_FLFS;
const ACTIVARFACTURA = import.meta.env.VITE_REACT_APP_FAAC;
const ANULARFACTURA = import.meta.env.VITE_REACT_APP_FAAN;

const Facturas = () => {
    // Obtén el userId y token del contexto
    const { userId, token } = useContext(UserContext);
  
    // Estado para almacenar las facturas
    const [facturas, setFacturas] = useState([]);
  
    // Función para cargar las facturas desde la API
    const cargarFacturas = () => {
      // Realiza una solicitud para obtener las facturas del usuario
      axios
        .get(`${FACTURAS}${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          // Almacena las facturas en el estado
          setFacturas(response.data.facturas);
        })
        .catch((error) => {
          console.error('Error al cargar las facturas:', error);
        });
    };
  
    // Efecto para cargar las facturas al montar el componente
    useEffect(() => {
      cargarFacturas();
    }, []);
  
    // Función para anular o activar una factura
    const handleAnularActivar = (facturaId, anulada) => {
      const ruta = anulada
        ? `${ACTIVARFACTURA}${userId}/${facturaId}`
        : `${ANULARFACTURA}${userId}/${facturaId}`;
  
      // Realiza una solicitud PATCH para anular o activar la factura
      axios
        .patch(ruta, null, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then(() => {
          // Actualiza las facturas después de la anulación o activación
          cargarFacturas();
        })
        .catch((error) => {
          console.error('Error al anular/activar la factura:', error);
        });
    };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4 mt-20">Lista de Facturas</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-300">Número</th>
              <th className="hidden md:table-cell px-6 py-3 border-b border-gray-300">Fecha</th>
              <th className="hidden md:table-cell px-6 py-3 border-b border-gray-300">Cliente</th>
              <th className="hidden sm:table-cell px-6 py-3 border-b border-gray-300">Importe</th>
              <th className="hidden sm:table-cell px-6 py-3 border-b border-gray-300">Orden</th>
              <th className="px-6 py-3 border-b border-gray-300 text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura._id}>
                <td className="px-6 py-4 border-b border-gray-300">{factura.numero}</td>
                <td className="hidden md:table-cell px-6 py-4 border-b border-gray-300">
                  {format(new Date(factura.fecha), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })}
                </td>
                <td className="hidden md:table-cell px-6 py-4 border-b border-gray-300">{factura.cliente}</td>
                <td className="hidden sm:table-cell px-6 py-4 border-b border-gray-300">
                  {factura.total.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                  })}
                </td>
                <td className="hidden sm:table-cell px-6 py-4 border-b border-gray-300">{factura.orden}</td>
                <td className="px-6 py-4 border-b border-gray-300 text-sm">
                  <Link to={`/comprobante/${factura._id}`}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                      Ver
                    </button>
                  </Link>
                  <button
                    className={`bg-${factura.anulada ? 'green' : 'red'}-500 hover:bg-${
                      factura.anulada ? 'green' : 'red'
                    }-700 text-white font-bold py-2 px-4 rounded`}
                    onClick={() => handleAnularActivar(factura._id, factura.anulada)}
                  >
                    {factura.anulada ? 'Activar' : 'Anular'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
  
  export default Facturas;
  
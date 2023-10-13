import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from '../utils/UserContexy';
import { format } from 'date-fns'; // Importa la función de formato de fecha
import { es } from 'date-fns/locale';

//URL
const FACTURA = import.meta.env.VITE_REACT_APP_FLFC;


const Comprobante = () => {
  const { userId, token } = useContext(UserContext);
  const { idFactura } = useParams();
  
  const [factura, setFactura] = useState(null);

  useEffect(() => {
    // Realiza una solicitud para obtener los detalles de la factura basados en el ID proporcionado en los parámetros
    axios
      .get(`${FACTURA}${userId}/${idFactura}`, {
        headers: {
          Authorization: `${token}`,
        }
      })
      .then((response) => {
        // Establece los detalles de la factura en el estado
        setFactura(response.data.factura);
      })
      .catch((error) => {
        // Maneja los errores de la solicitud de obtención de detalles de la factura
        console.error('Error al obtener detalles de la factura:', error);
      });
  }, [idFactura, userId, token]);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Comprobante de Factura</h2>
      {factura && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Detalles de la Factura</h3>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="py-2 px-4 border border-gray-300 font-semibold">Número</td>
                <td className="py-2 px-4 border border-gray-300">{factura.numero}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border border-gray-300 font-semibold">Cliente</td>
                <td className="py-2 px-4 border border-gray-300">{factura.cliente}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border border-gray-300 font-semibold">Fecha</td>
                {/* Cambio para formatear la fecha */}
                <td className="py-2 px-4 border border-gray-300">
                  {format(new Date(factura.fecha), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border border-gray-300 font-semibold">Detalles</td>
                <td className="py-2 px-4 border border-gray-300">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border border-gray-300">Detalle</th>
                        <th className="py-2 px-4 border border-gray-300">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {factura.detalles.map((detalle, index) => (
                        <tr key={index}>
                          <td className="py-2 px-4 border border-gray-300">{detalle.nombreTarea}</td>
                          <td className="py-2 px-4 border border-gray-300">
                            {/* Cambio para formatear el importe como moneda */}
                            {detalle.precio.toLocaleString('es-AR', {
                              style: 'currency',
                              currency: 'ARS',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border border-gray-300 font-semibold">Total</td>
                <td className="py-2 px-4 border border-gray-300">
                  {/* Cambio para formatear el total como moneda */}
                  {factura.total.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                  })}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border border-gray-300 font-semibold">Última Actualización</td>
                {format(new Date(factura.updatedAt), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })}
              </tr>
              <tr>
                <td className="py-2 px-4 border border-gray-300 font-semibold">Anulada</td>
                <td className="py-2 px-4 border border-gray-300">
                  {factura.anulada ? 'Sí' : 'No'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Comprobante;

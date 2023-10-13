import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

//URL
const GETOR = import.meta.env.VITE_REACT_APP_TKGO;

const DetalleOrden = () => {
  const { orden } = useParams();
  const [ordenData, setOrdenData] = useState({});
  const [facturaData, setFacturaData] = useState({});
  const [trabajadores, setTrabajadores] = useState([]);
  const [carData, setCarData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordenResponse = await axios.get(`${GETOR}${orden}`);
        const { ticket, factura, trabajadores, car } = ordenResponse.data;

        setOrdenData(ticket);
        setFacturaData(factura || {});
        setTrabajadores(trabajadores);
        setCarData(car);
      } catch (error) {
        console.error('Error al obtener los detalles de la orden:', error);
      }
    };

    fetchData();
  }, [orden]);

  return (
    <div className='mt-20 mb-24'>
      <h2 className="text-2xl font-semibold mb-4">Detalle de Orden</h2>

      <div className="mb-4">
        <h3 className="border rounded-lg p-4 text-center text-xl font-semibold mb-2 border-gray-700">Orden de Trabajo</h3>
        <table className="w-full mb-4">
          <tbody>
            <tr>
              <td className="border p-2 text-center border-gray-700">Número de Orden:</td>
              <td className="border p-2 text-center border-gray-700">{ordenData.orden}</td>
            </tr>
            <tr>
              <td className="border p-2 text-center border-gray-700">Fecha de Ingreso a Taller:</td>
              <td className="border p-2 text-center border-gray-700">{new Date(ordenData.createdAt).toLocaleDateString('es-ES')}</td>
            </tr>
            <tr>
              <td className="border p-2 text-center border-gray-700">Observación de Recepción:</td>
              <td className="border p-2 text-center border-gray-700">{ordenData.observacionRecepcion}</td>
            </tr>
            <tr>
              <td className="border p-2 text-center border-gray-700">Terminado:</td>
              <td className="border p-2 text-center border-gray-700">{ordenData.terminado ? 'Sí' : 'No'}</td>
            </tr>
            <tr>
              <td className="border p-2 text-center border-gray-700">Facturado:</td>
              <td className="border p-2 text-center border-gray-700">{ordenData.facturado ? 'Sí' : 'No'}</td>
            </tr>
            <tr>
              <td className="border p-2 text-center border-gray-700">Kilómetros:</td>
              <td className="border p-2 text-center border-gray-700">{ordenData.km}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <h3 className="border rounded-lg p-4 text-center text-xl font-semibold mb-2 border-gray-700">Trabajos Realizados</h3>
        <table className="w-full mb-4">
          <tbody>
            {facturaData.detalles ? (
              facturaData.detalles.map((detalle, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center border-gray-700">Tarea Realizada {index + 1}:</td>
                  <td className="border p-2 text-center border-gray-700">{detalle.nombreTarea}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border p-2 text-center border-gray-700">No hay detalles disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Trabajador</h3>
        <table className="w-full mb-4">
          <tbody>
            {trabajadores.length > 0 ? (
              trabajadores.map((trabajador, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center border-gray-700">Trabajador {index + 1}:</td>
                  <td className="border p-2 text-center border-gray-700">{trabajador}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border p-2 text-center border-gray-700">No hay trabajadores asignados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {Object.keys(facturaData).length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Factura</h3>
          <table className="w-full mb-4">
            <tbody>
              <tr>
                <td className="border p-2 text-center border-gray-700">Número:</td>
                <td className="border p-2 text-center border-gray-700">{facturaData.numero}</td>
              </tr>
              <tr>
                <td className="border p-2 text-center border-gray-700">Observación:</td>
                <td className="border p-2 text-center border-gray-700">{facturaData.observacion}</td>
              </tr>
              <tr>
                <td className="border p-2 text-center border-gray-700">Cliente:</td>
                <td className="border p-2 text-center border-gray-700">{facturaData.cliente}</td>
              </tr>
              <tr>
                <td className="border p-2 text-center border-gray-700">Fecha:</td>
                <td className="border p-2 text-center border-gray-700">{new Date(facturaData.fecha).toLocaleDateString('es-ES')}</td>
              </tr>
              {facturaData.detalles &&
                facturaData.detalles.map((detalle, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-center border-gray-700">Detalle {index + 1}:</td>
                    <td className="border p-2 text-center border-gray-700">{detalle.nombreTarea}</td>
                  </tr>
                ))}
              <tr>
                <td className="border p-2 text-center border-gray-700">Total:</td>
                <td className="border p-2 text-center border-gray-700">{facturaData.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Auto</h3>
        <table className="w-full mb-4">
          <tbody>
            <tr>
              <td className="border p-2 text-center border-gray-700">Patente:</td>
              <td className="border p-2 text-center border-gray-700">{carData.patente}</td>
            </tr>
            <tr>
              <td className="border p-2 text-center border-gray-700">Año:</td>
              <td className="border p-2 text-center border-gray-700">{carData.year}</td>
            </tr>
            <tr>
              <td className="border p-2 text-center border-gray-700">Modelo:</td>
              <td className="border p-2 text-center border-gray-700">{carData.modelo}</td>
            </tr>
            <tr>
              <td className="border p-2 text-center border-gray-700">Marca:</td>
              <td className="border p-2 text-center border-gray-700">{carData.marca}</td>
            </tr>
            <tr>
              <td className="border p-2 text-center border-gray-700">Color:</td>
              <td className="border p-2 text-center border-gray-700">{carData.color}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetalleOrden;

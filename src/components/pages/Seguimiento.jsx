import { useState } from 'react';
import axios from 'axios'; // Importa Axios

// URL
const CONS = import.meta.env.VITE_REACT_APP_TKCO;

const Seguimiento = () => {
  const [patente, setPatente] = useState('');
  const [trabajos, setTrabajos] = useState([]);

  const buscarTrabajos = async () => {
    try {
      // Realiza la consulta a la API utilizando Axios
      const response = await axios.get(`${CONS}${patente}`);

      // Verifica si la respuesta es exitosa
      if (response.status === 200) {
        setTrabajos(response.data.tickets);
      } else {
        throw new Error('Error en la consulta');
      }
    } catch (error) {
      console.error(error);
      alert("Patente no encontrada")
      setTrabajos([]);
    }
  };

  const resetearBusqueda = () => {
    setPatente('');
    setTrabajos([]);
  };

  return (
    <div className='mt-20'>
      <h2 className="text-2xl font-semibold mb-4 text-center">Seguimiento de Trabajos</h2>
      <div className="mb-4 w-1/2 mx-auto">
        <label htmlFor="patente" className="block mb-2">Patente:</label>
        <input
          type="text"
          id="patente"
          name="patente"
          value={patente}
          onChange={(e) => setPatente(e.target.value)}
          placeholder="Ingrese la patente del vehículo"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>
      <div className="mb-4 flex justify-center">
        <button
          type="button"
          onClick={buscarTrabajos}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={resetearBusqueda}
          className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
        >
          Reset
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse sm:w-5/6 md:w-4/6 lg:w-3/4 xl:w-2/3 mx-auto mb-20">
          <thead>
            <tr>
              <th className="border p-2 text-center border-gray-700">Orden</th>
              <th className="border p-2 text-center border-gray-700">Terminado</th>
              <th className="border p-2 hidden sm:table-cell text-center border-gray-700">Facturado</th>
              <th className="border p-2 hidden sm:table-cell text-center border-gray-700">Km</th>
              <th className="border p-2 text-center border-gray-700">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {trabajos.map((trabajo, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2 border-gray-700">{trabajo.orden}</td>
                <td className="border p-2 border-gray-700">{trabajo.terminado ? 'Sí' : 'No'}</td>
                <td className="border p-2 hidden sm:table-cell border-gray-700">{trabajo.facturado ? 'Sí' : 'No'}</td>
                <td className="border p-2 hidden sm:table-cell border-gray-700">{trabajo.km}</td>
                <td className="border p-2 border-gray-700">
                  <a href={`/detalleOrden/${trabajo.orden}`}>Detalle</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Seguimiento;

import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../utils/UserContexy';

//URL
const CREATE = import.meta.env.VITE_REACT_APP_FACR;
const ORDENDETAIL = import.meta.env.VITE_REACT_APP_TKGO;

const Facturacion = () => {
  const { token, userId } = useContext(UserContext);
  const { orden } = useParams();
  const navigate = useNavigate(); // Obtiene la función navigate

  const [formData, setFormData] = useState({
    ordenId: '', // Asigna el ID de la URL a ordenId por defecto
    observacion: '',
    cliente: '',
    fecha: '',
  });

  const [ordenDetails, setOrdenDetails] = useState(null); // Estado para almacenar los detalles de la orden

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Realizar la solicitud POST
    try {
      const response = await axios.post(
        `${CREATE}${userId}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // Procesar la respuesta si es necesario
      console.log(response.data);

      // Redirige al usuario a la página del comprobante con el idFactura
      navigate(`/comprobante/${response.data.factura._id}`);

      // Reiniciar el formulario o redirigir a otra página
      setFormData({
        ordenId: '', // Vuelve a asignar el ID de la URL
        observacion: '',
        cliente: '',
        fecha: '',
      });
    } catch (error) {
      // Manejar errores de la solicitud
      console.error('Error al crear la factura:', error);
      // Puedes mostrar un mensaje de error al usuario si lo deseas
    }
  };

  useEffect(() => {
    // Realiza una solicitud para obtener los detalles de la orden basados en el ID proporcionado en los parámetros
    axios
      .get(`${ORDENDETAIL}${orden}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        // Establece los detalles de la orden en el estado
        console.log(response.data);
        setOrdenDetails(response.data); // Asegúrate de que la respuesta de la API contenga los detalles necesarios
        // Reiniciar el formulario o redirigir a otra página
        setFormData({
          ordenId: response.data.ticket._id , // Vuelve a asignar el ID de la URL
          observacion: '',
          cliente: '',
          fecha: '',
        });
        })
      .catch((error) => {
        // Maneja los errores de la solicitud de obtención de detalles de la orden
        console.error('Error al obtener detalles de la orden:', error);
        // Puedes mostrar un mensaje de error al usuario si lo deseas
      });
  }, [orden, token]);

  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, options);
    return formattedDate;
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mt-20">Proceso de Facturacion</h2>
      {ordenDetails && (
        // <div>
        //   <h3 className="text-xl font-semibold mb-2 mt-6">Detalles de la Orden</h3>
        //   <p>Patente: {ordenDetails.car.patente}</p>
        //   <p>Tipo: {ordenDetails.car.tipo}</p>
        //   <p>Modelo: {ordenDetails.car.modelo}</p>
        //   <p>Observacion Recepcion: {ordenDetails.ticket.observacionRecepcion}</p>
        //   <p>Entregado: {ordenDetails.ticket.fechaEntrega}</p>
        //   {ordenDetails.detalles.map((trabajo, index) => (
        //     <p key={index}>Trabajo {index+1}: {trabajo}</p>
        //   ))}
        //   {/* Agrega más detalles de la orden según la estructura de la respuesta */}
        // </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Detalles de la Orden</h3>
          <table className="w-full border-collapse border rounded-lg">
            <tbody>
              <tr>
                <td className="py-2 px-4 font-bold">Patente:</td>
                <td className="py-2 px-4">{ordenDetails.car.patente}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-bold">Tipo:</td>
                <td className="py-2 px-4">{ordenDetails.car.tipo}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-bold">Modelo:</td>
                <td className="py-2 px-4">{ordenDetails.car.modelo}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-bold">Observación Recepción:</td>
                <td className="py-2 px-4">{ordenDetails.ticket.observacionRecepcion}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-bold">Entregado:</td>
                  {formatDate(ordenDetails.ticket.fechaEntrega)}
              </tr>
              {ordenDetails.detalles.map((trabajo, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 font-bold">Trabajo {index + 1}:</td>
                  <td className="py-2 px-4">{trabajo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}
      <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Observación
            </label>
            <textarea
              name="observacion"
              value={formData.observacion}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
              placeholder="Colocar Observación de ser necesario"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cliente
            </label>
            <input
              type="text"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
              placeholder="Colocar nombre de Cliente"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Fecha
            </label>
            <input
              type='date'
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md mb-20"
        >
          Crear Factura
        </button>
      </form>
    </div>
  );
};

export default Facturacion;

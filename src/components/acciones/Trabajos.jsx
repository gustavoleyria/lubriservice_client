// 

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../utils/UserContexy';

//URL
const TICKET = import.meta.env.VITE_REACT_APP_TKGO;
const TRABAJOS = import.meta.env.VITE_REACT_APP_TRGT;
const TRABAJADORES = import.meta.env.VITE_REACT_APP_TAGT;
const DELETETRABAJO = import.meta.env.VITE_REACT_APP_TRDT;
const AGREGARTRABAJO = import.meta.env.VITE_REACT_APP_TRAT;
const AGREGARTRABAJADOR = import.meta.env.VITE_REACT_APP_TAAT;
const DELETETRABAJADOR = import.meta.env.VITE_REACT_APP_TADT;

const Trabajos = () => {
  const { token, userId } = useContext(UserContext);
  const navigate = useNavigate();
  const { orden } = useParams();
  const [detalleOrden, setDetalleOrden] = useState(null);
  const [trabajos, setTrabajos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTrabajo, setSelectedTrabajo] = useState(null);
  const [selectedTrabajador, setSelectedTrabajador] = useState(null);

  useEffect(() => {
    // Realizar la solicitud para obtener los detalles de la orden
    axios
      .get(`${TICKET}${orden}`)
      .then((response) => {
        const data = response.data;
        setDetalleOrden(data);
      })
      .catch((error) => {
        console.error('Error al obtener los detalles de la orden:', error);
      });

    // Realizar la solicitud para obtener los trabajos
    axios
      .get(`${TRABAJOS}${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        const trabajosResponse = response.data.trabajos;
        setTrabajos(trabajosResponse);
      })
      .catch((error) => {
        console.error('Error al obtener los trabajos:', error);
      });

    // Realizar la solicitud para obtener los trabajadores
    axios
      .get(`${TRABAJADORES}${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        const trabajadoresResponse = response.data.trabajadores;
        setTrabajadores(trabajadoresResponse);
      })
      .catch((error) => {
        console.error('Error al obtener los trabajadores:', error);
      });
  }, [orden, token, userId, showForm]);

  const handleAgregarTrabajo = () => {
    // Mostrar el formulario para agregar trabajo
    setShowForm(true);
  };

  const handleAgregarTrabajador = () => {
    // Mostrar el formulario para agregar trabajo
    setShowForm(true);
  };

  const handleEliminarTrabajo = async (idTicket, idTrabajo) => {
    try {
      // Realiza la solicitud para eliminar el trabajo del ticket
      const response = await axios.patch(
        `${DELETETRABAJO}${userId}`,
        { idTicket, idTrabajo },
        {
          headers: {
            Authorization: `${token}`, // Adjunta el token al encabezado
          },
        }
      );

      // Verifica si la solicitud se realizó con éxito
      if (response.status === 200) {
        // Actualiza los trabajos después de eliminar un trabajo
        const trabajosActualizados = trabajos.filter((trabajo) => trabajo._id !== idTrabajo);
        setTrabajos(trabajosActualizados);

        // Realiza cualquier acción adicional que necesites después de eliminar el trabajo
        console.log('Trabajo eliminado con éxito');
      } else {
        console.error('Hubo un error al eliminar el trabajo');
      }
    } catch (error) {
      console.error('Error al eliminar el trabajo:', error);
    }
  };

  const handleAgregarTrabajoSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedTrabajo === null) {
        alert('Por favor, seleccione un trabajo antes de agregarlo.');
        return;
      }

      // Realizar la solicitud para agregar el trabajo al ticket
      const response = await axios.patch(
        `${AGREGARTRABAJO}${userId}`,
        { idTicket: detalleOrden.ticket._id, idTrabajo: selectedTrabajo },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // Verificar si la solicitud se realizó con éxito
      if (response.status === 200) {
        // Actualizar la lista de trabajos después de agregar uno nuevo
        const trabajoAgregado = trabajos.find((trabajo) => trabajo._id === selectedTrabajo);
        setTrabajos([...trabajos, trabajoAgregado]);

        // Ocultar el formulario
        setShowForm(false);

        // Realiza cualquier acción adicional que necesites después de agregar el trabajo
        console.log('Trabajo agregado con éxito');
      } else {
        console.error('Hubo un error al agregar el trabajo:', response.data); // Mostrar el mensaje de error completo
        alert('Hubo un error al agregar el trabajo. Inténtelo de nuevo más tarde.');
      }
    } catch (error) {
      console.error('Error al agregar el trabajo:', error); // Mostrar el mensaje de error completo
      alert('Error al agregar el trabajo. Inténtelo de nuevo más tarde.');
    }
  };

  const handleAgregarTrabajadorSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedTrabajador === null) {
        alert('Por favor, seleccione un trabajador antes de agregarlo.');
        return;
      }

      // Realizar la solicitud para agregar el trabajo al ticket
      const response = await axios.patch(
        `${AGREGARTRABAJADOR}${userId}`,
        { idTicket: detalleOrden.ticket._id, idTrabajador: selectedTrabajador },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // Verificar si la solicitud se realizó con éxito
      if (response.status === 200) {
        // Actualizar la lista de trabajos después de agregar uno nuevo
        const trabajadorAgregado = trabajadores.find((trabajador) => trabajador._id === selectedTrabajador);
        setTrabajadores([...trabajadores, trabajadorAgregado]);

        // Ocultar el formulario
        setShowForm(false);

        // Realiza cualquier acción adicional que necesites después de agregar el trabajo
        console.log('Trabajador agregado con éxito');
      } else {
        console.error('Hubo un error al agregar el trabajador:', response.data); // Mostrar el mensaje de error completo
        alert('Hubo un error al agregar el trabajador. Inténtelo de nuevo más tarde.');
      }
    } catch (error) {
      console.error('Error al agregar el trabajador:', error); // Mostrar el mensaje de error completo
      alert('Error al agregar el trabajador. Inténtelo de nuevo más tarde.');
    }
  };

  const handleEliminarTrabajador = async (idTicket, idTrabajador) => {
    try {
      // Realiza la solicitud para eliminar el trabajo del ticket
      const response = await axios.patch(
        `${DELETETRABAJADOR}${userId}`,
        { idTicket, idTrabajador },
        {
          headers: {
            Authorization: `${token}`, // Adjunta el token al encabezado
          },
        }
      );

      // Verifica si la solicitud se realizó con éxito
      if (response.status === 200) {
        // Actualiza los trabajos después de eliminar un trabajo
        const trabajadoresActualizados = trabajadores.filter((trabajador) => trabajador._id !== idTrabajador);
        setTrabajadores(trabajadoresActualizados);

        // Realiza cualquier acción adicional que necesites después de eliminar el trabajo
        console.log('Trabajador eliminado con éxito');
      } else {
        console.error('Hubo un error al eliminar al trabajador');
      }
    } catch (error) {
      console.error('Error al eliminar el trabajador:', error);
    }
  };

  const renderTrabajos = () => {
    // Filtrar los trabajos que están incluidos en detalleOrden.ticket.trabajoId
    const trabajosEnOrden = trabajos.filter((trabajo) =>
      detalleOrden.ticket.trabajoId.includes(trabajo._id)
    );

    // Mapear y renderizar solo los trabajos que están en la orden
    return trabajosEnOrden.map((trabajo) => (
      <tr key={trabajo._id}>
        <td className="font-semibold border border-t-2 border-l-2 border-gray-300">{trabajo.trabajo}</td>
        <td className="font-semibold border border-t-2 border-l-2 border-gray-300 hidden md:table-cell">{trabajo.detalle}</td>
        <td className="font-semibold border border-t-2 border-l-2 border-gray-300">
          <button
            onClick={() => handleEliminarTrabajo(detalleOrden.ticket._id, trabajo._id)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </td>
      </tr>
    ));
  };

  const renderTrabajadores = () => {
    // Filtrar los trabajos que están incluidos en detalleOrden.ticket.trabajoId
    const trabajadoresEnOrden = trabajadores.filter((trabajador) =>
      detalleOrden.ticket.trabajadorId.includes(trabajador._id)
    );

    return trabajadoresEnOrden.map((trabajador) => (
      <tr key={trabajador._id}>
        <td className="font-semibold border border-t-2 border-l-2 border-gray-300">{`${trabajador.nombre} ${trabajador.apellido}`}</td>
        <td className="font-semibold border border-t-2 border-l-2 border-gray-300">{trabajador.especialidad}</td>
        <td className="font-semibold border border-t-2 border-l-2 border-gray-300">
          <button
            onClick={() => handleEliminarTrabajador(detalleOrden.ticket._id, trabajador._id)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </td>
      </tr>
    ));
  };

  if (!detalleOrden) {
    return <p>Cargando detalles de la orden...</p>;
  }

  if (detalleOrden.ticket.terminado) {
    alert(`La orden ${orden} ha sido finalizada.`);
    navigate('/garage');
    return null;
  }

  return (
    <div className="mb-20">
      <h2 className="mt-20 text-xl font-semibold">Detalles de la Orden</h2>
      <table className="table-auto w-full">
        <tbody>
          <tr>
            <td className="font-semibold border border-t-2 border-l-2 border-gray-300">Concepto</td>
            <td className="border border-t-2 border-l-2 border-gray-300">Valores</td>
            {/* <td className="border border-t-2 border-l-2 border-gray-300">Modificar</td> */}
          </tr>
          <tr>
            <td className="border border-t-2 border-l-2 border-gray-300">Orden</td>
            <td className="border border-t-2 border-l-2 border-gray-300">{orden}</td>
            {/* <td className="border border-t-2 border-l-2 border-gray-300"></td> */}
          </tr>
          <tr>
            <td className="border border-t-2 border-l-2 border-gray-300">Observación de Recepción</td>
            <td className="border border-t-2 border-l-2 border-gray-300">{detalleOrden.ticket.observacionRecepcion}</td>
            {/* <td className="border border-t-2 border-l-2 border-gray-300"></td> */}
          </tr>
          <tr>
            <td className="border border-t-2 border-l-2 border-gray-300">Fecha de Creación</td>
            <td className="border border-t-2 border-l-2 border-gray-300">{new Date(detalleOrden.ticket.createdAt).toLocaleDateString()}</td>
            {/* <td className="border border-t-2 border-l-2 border-gray-300"></td> */}
          </tr>
          <tr>
            <td className="border border-t-2 border-l-2 border-gray-300">Patente</td>
            <td className="border border-t-2 border-l-2 border-gray-300">{detalleOrden.car.patente}</td>
            {/* <td className="border border-t-2 border-l-2 border-gray-300"></td> */}
          </tr>
          <tr>
            <td className="border border-t-2 border-l-2 border-gray-300">Año</td>
            <td className="border border-t-2 border-l-2 border-gray-300">{detalleOrden.car.year}</td>
            {/* <td className="border border-t-2 border-l-2 border-gray-300"></td> */}
          </tr>
          <tr>
            <td className="border border-t-2 border-l-2 border-gray-300">Modelo</td>
            <td className="border border-t-2 border-l-2 border-gray-300">{detalleOrden.car.modelo}</td>
            {/* <td className="border border-t-2 border-l-2 border-gray-300"></td> */}
          </tr>
          <tr>
            <td className="border border-t-2 border-l-2 border-gray-300">Marca</td>
            <td className="border border-t-2 border-l-2 border-gray-300">{detalleOrden.car.marca}</td>
            {/* <td className="border border-t-2 border-l-2 border-gray-300"></td> */}
          </tr>
          <tr>
            <td className="border border-t-2 border-l-2 border-gray-300">Rodado</td>
            <td className="border border-t-2 border-l-2 border-gray-300">{detalleOrden.car.rodado}</td>
            {/* <td className="border border-t-2 border-l-2 border-gray-300"></td> */}
          </tr>
        </tbody>
      </table>

      <h2 className="mt-8 text-xl font-semibold">Trabajos</h2>
      <button
        onClick={handleAgregarTrabajo}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2 mb-4"
      >
        Agregar Trabajo
      </button>
      {showForm ? (
        <form onSubmit={handleAgregarTrabajoSubmit} className="mt-4">
          <label className="block">
            Seleccione un trabajo:
            <select
              value={selectedTrabajo}
              onChange={(e) => setSelectedTrabajo(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded"
            >
              <option value="" disabled>
                Seleccione un trabajo
              </option>
              {trabajos.map((trabajo) => (
                <option key={trabajo._id} value={trabajo._id}>
                  {trabajo.detalle}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-700 ml-2 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="font-semibold border border-t-2 border-l-2 border-gray-300">Trabajo</td>
              <td className="font-semibold border border-t-2 border-l-2 border-gray-300 hidden md:table-cell">Detalle</td>
              <td className="font-semibold border border-t-2 border-l-2 border-gray-300">Eliminar</td>
            </tr>
            {renderTrabajos()}
          </tbody>
        </table>
      )}

      <h2 className="mt-8 text-xl font-semibold">Trabajadores</h2>
      <button
        onClick={handleAgregarTrabajador}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
      >
        Agregar Trabajador
      </button>
      {showForm ? (
        <form onSubmit={handleAgregarTrabajadorSubmit} className="mt-4">
          <label className="block">
            Seleccione un trabajador:
            <select
              value={selectedTrabajador}
              onChange={(e) => setSelectedTrabajador(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded"
            >
              <option value="" disabled>
                Seleccione un trabajador
              </option>
              {trabajadores.map((trabajador) => (
                <option key={trabajador._id} value={trabajador._id}>
                  {`${trabajador.nombre} ${trabajador.apellido} - ${trabajador.especialidad}`}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-700 ml-2 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <table className="table-auto w-full mt-4">
          <tbody>
            <tr>
              <td className="font-semibold border border-t-2 border-l-2 border-gray-300">Trabajador</td>
              <td className="font-semibold border border-t-2 border-l-2 border-gray-300">Especialidad</td>
              <td className="font-semibold border border-t-2 border-l-2 border-gray-300">Eliminar</td>
            </tr>
            {renderTrabajadores()}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Trabajos;

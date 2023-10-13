import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../utils/UserContexy';
import axios from 'axios';

//URL
const TICKETS = import.meta.env.VITE_REACT_APP_TKGT;
const ROLE = import.meta.env.VITE_REACT_APP_UGRO;
const FACTURAS = import.meta.env.VITE_REACT_APP_FLFS;

// Importa íconos de react-icons y tailwindcss
import { FaWrench, FaMoneyBill, FaEdit, FaEye } from 'react-icons/fa';

const Garage = () => {
  const { token, userId, isUserLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [showTable, setShowTable] = useState(false); // Para mostrar u ocultar la tabla


  const fetchTickets = () => {
    axios
      .get(`${TICKETS}${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        const ticketsData = response.data.tickets;
  
        axios
          .get(`${FACTURAS}${userId}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            const facturasData = response.data.facturas;
  
            // Modificar los datos de los ticketsData
            const modifiedTicketsData = ticketsData.map((ticket) => {
              // Buscar la factura correspondiente
              const facturaCorrespondiente = facturasData.find((factura) => factura.ordenId === ticket._id);
  
              // Crear un nuevo objeto con la propiedad idFactura
              return {
                ...ticket,
                idFactura: facturaCorrespondiente ? facturaCorrespondiente._id : null,
              };
            });
  
            // Establecer los datos de los tickets modificados en el estado
            console.log(modifiedTicketsData)
            setTickets(modifiedTicketsData);
  
            // Mostrar la tabla
            setShowTable(true);
          })
          .catch((error) => {
            console.error('Error al obtener los tickets:', error);
            // Manejo de errores: Mostrar un alert y redirigir a /home
            alert('Ocurrió un error al obtener los tickets.');
            navigate('/home');
          });
      })
      .catch((error) => {
        console.error('Error al obtener los tickets:', error);
        // Manejo de errores: Mostrar un alert y redirigir a /home
        alert('Ocurrió un error al obtener los tickets.');
        navigate('/home');
      });
  };
  
  

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
          if (role === 'MANAGER' || role === 'OPERADOR') {
            setUserRole(role);

            // Mostrar la tabla cuando el rol es correcto
            setShowTable(true);
          } else {
            // Si el rol no es correcto, mostrar un alert y redirigir a /home
            alert('No tiene los permisos necesarios.');
            navigate('/home');
          }
        })
        .catch((error) => {
          console.error('Error al obtener el rol del usuario:', error);
          // Manejo de errores: Mostrar un alert y redirigir a /home
          alert('Ocurrió un error al obtener el rol del usuario.');
          navigate('/home');
        });
    }
  }, [isUserLoggedIn, navigate, token, userId]);

  // return (
  //   <div className="container mx-auto mt-8">
  //     <h2 className="text-2xl font-semibold mb-4">Garage</h2>
  //     {/* Botones "Todos" y "Crear Orden" */}
  //     {userRole && (
  //       <div className="space-x-4 mb-4">
  //         <button
  //           onClick={fetchTickets}
  //           className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md"
  //         >
  //           Todos
  //         </button>
  //         <Link
  //           to="/createTicketOrden" // Reemplaza '/crear-orden' con la ruta correcta
  //           className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-md"
  //         >
  //           Crear Orden
  //         </Link>
  //       </div>
  //     )}
  //     {/* Agrega el filtro aquí */}

  //     {/* Mostrar la tabla si showTable es verdadero */}
  //     {showTable && (
  //       <table className="min-w-full divide-y divide-gray-200 mb-16">
  //         <thead className="bg-gray-50">
  //           <tr>
  //             <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
  //               ORDEN
  //             </th>
  //             <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
  //               TERMINADO
  //             </th>
  //             <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
  //               Facturado
  //             </th>
  //             <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
  //               ACCIONES
  //             </th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-white divide-y divide-gray-200">
  //           {tickets.map((ticket) => (
  //             <tr key={ticket._id} className="hover:bg-gray-100">
  //               <td className="px-6 py-4 whitespace-nowrap">{ticket.orden}</td>
  //               <td className="px-6 py-4 whitespace-nowrap">
  //                 {ticket.terminado ? 'Sí' : 'No'}
  //               </td>
  //               <td className="px-6 py-4 whitespace-nowrap">
  //                 {ticket.facturado ? 'Sí' : 'No'}
  //               </td>
  //               <td className="px-6 py-4 whitespace-nowrap">
  //                 <Link
  //                   to={`/detalleOrden/${ticket.orden}`}
  //                   className="text-indigo-600 hover:text-indigo-900 mr-4"
  //                 >
  //                   <FaEye className="inline-block w-4 h-4 mr-1" />
  //                   Ver
  //                 </Link>
  //                 <Link
  //                   to={`/trabajos/${ticket.orden}`}
  //                   className="text-indigo-600 hover:text-indigo-900"
  //                 >
  //                   <FaWrench className="inline-block w-4 h-4 mr-1" />
  //                   Trabajos
  //                 </Link>
  //                 {ticket.terminado ? (
  //                   <Link
  //                     to={`/finalizar/${ticket.orden}`}
  //                     className="text-red-600 hover:text-red-900 ml-4"
  //                   >
  //                     <FaEdit className="inline-block w-4 h-4 mr-1" />
  //                     Reaperturar
  //                   </Link>
  //                 ) : (
  //                   <Link
  //                     to={`/finalizar/${ticket.orden}`}
  //                     className="text-indigo-600 hover:text-indigo-900 ml-4"
  //                   >
  //                     <FaEdit className="inline-block w-4 h-4 mr-1" />
  //                     Finalizar
  //                   </Link>
  //                 )
  //                 }

  //                 {ticket.facturado ? (
  //                   <Link
  //                     to={`/comprobante/${ticket.idFactura}`}
  //                     className="text-red-600 hover:text-red-900 ml-4"
  //                   >
  //                     <FaEdit className="inline-block w-4 h-4 mr-1" />
  //                     Facturado
  //                   </Link>
  //                 ) : (
  //                   <Link
  //                     to={`/facturar/${ticket.orden}`}
  //                     className="text-indigo-600 hover:text-indigo-900 ml-4"
  //                   >
  //                     <FaMoneyBill className="inline-block w-4 h-4 mr-1" />
  //                     Facturar
  //                   </Link> 
  //                   )
  //                 }



                  
                                   
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     )}
  //   </div>
  // );
  //               }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Garage</h2>
      {/* Botones "Todos" y "Crear Orden" */}
      {userRole && (
        <div className="space-x-4 mb-4">
          <button
            onClick={fetchTickets}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md"
          >
            Todos
          </button>
          <Link
            to="/createTicketOrden"
            className="px-4 py-2 bg-green-500 text-white hover-bg-green-600 rounded-md"
          >
            Crear Orden
          </Link>
        </div>
      )}
      {/* Agrega el filtro aquí */}

      {/* Mostrar la tabla si showTable es verdadero */}
      {showTable && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 mb-16">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ORDEN
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  TERMINADO
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Facturado
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{ticket.orden}</td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-center">
                    {ticket.terminado ? 'Sí' : 'No'}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-center">
                    {ticket.facturado ? 'Sí' : 'No'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Link
                      to={`/detalleOrden/${ticket.orden}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FaEye className="inline-block w-4 h-4 mr-1" />
                      <span className="hidden md:inline">Ver</span>
                    </Link>
                    <Link
                      to={`/trabajos/${ticket.orden}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FaWrench className="inline-block w-4 h-4 mr-1" />
                      <span className="hidden md:inline">Trabajos</span>                      
                    </Link>
                    {ticket.terminado ? (
                      <Link
                        to={`/finalizar/${ticket.orden}`}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        <FaEdit className="inline-block w-4 h-4 mr-1" />
                        <span className="hidden md:inline">Reaperturar</span>  
                      </Link>
                    ) : (
                      <Link
                        to={`/finalizar/${ticket.orden}`}
                        className="text-indigo-600 hover:text-indigo-900 ml-4"
                      >
                        <FaEdit className="inline-block w-4 h-4 mr-1" />
                        <span className="hidden md:inline">Finalizar</span>  
                      </Link>
      )}

                    {ticket.facturado ? (
                      <Link
                        to={`/comprobante/${ticket.idFactura}`}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        <FaMoneyBill className="inline-block w-4 h-4 mr-1" />
                        <span className="hidden md:inline">Facturado</span> 
                      </Link>
                    ) : (
                      <Link
                        to={`/facturar/${ticket.orden}`}
                        className="text-indigo-600 hover:text-indigo-900 ml-4"
                      >
                        <FaMoneyBill className="inline-block w-4 h-4 mr-1" />
                        <span className="hidden md:inline">Facturar</span> 
                      </Link>
      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      }
    </div>
  );
};
 

export default Garage;


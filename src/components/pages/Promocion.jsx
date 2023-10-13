import { useState, useEffect } from 'react';
import axios from 'axios';

//URL
const PROM = import.meta.env.VITE_REACT_APP_PLPS;

// Componente individual de promoción
const Promocion = ({ promocion }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${
        hovered ? 'transform scale-105' : ''
      } transition-transform duration-300 ease-in-out`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={promocion.imagen}
        alt={promocion.titulo}
        className="w-full h-auto"
      />
    </div>
  );
};

// Componente de Promociones
const Promociones = () => {
  // Estado para el número de columnas en el grid
  const [numColumns, setNumColumns] = useState(3);

  // Función para determinar el número de columnas según el ancho de la pantalla
  const calcularNumColumns = () => {
    if (window.innerWidth >= 768) {
      setNumColumns(3); // Tres columnas en pantallas más grandes
    } else if (window.innerWidth >= 520) {
      setNumColumns(2); // Dos columnas en pantallas medianas
    } else {
      setNumColumns(1); // Una columna en pantallas pequeñas (por ejemplo, celulares)
    }
  };


  //Estado para almacenar la lista de promociones
  const [promociones, setPromociones] = useState([]);

  useEffect(() => {
    // Hacer la solicitud a la API usando Axios
    axios.get(`${PROM}`)
      .then(response => {
        // Almacenar la lista de promociones en el estado
        console.log(response)
        setPromociones(response.data.promociones);
      })
      .catch(error => {
        console.error('Error al obtener promociones:', error);
      });
  }, []); // El [] como segundo argumento asegura que este efecto solo se ejecute una vez, al montar el componente

  

  // Calcular el número de columnas al cargar y al redimensionar la ventana
  useEffect(() => {
    calcularNumColumns();
    window.addEventListener('resize', calcularNumColumns);
    return () => {
      window.removeEventListener('resize', calcularNumColumns);
    };
  }, []);

  // Construye la cadena de clases CSS para el grid
  const gridClass = `grid grid-cols-2 md:grid-cols-3 gap-4 mt-4`;
  console.log(gridClass)
  console.log(promociones)

  return (
    <div className="container mx-auto mt-20 mb-24">
      {/* Título */}
      <h1 className="text-3xl text-center font-semibold">
        PROMOCIONES DEL MES
      </h1>

      {/* Grid de promociones */}
      <div className={gridClass}>
        {promociones.map((promocion) => (
          <Promocion key={promocion._id} promocion={promocion} />
        ))}
      </div>
    </div>
  );
};

export default Promociones;




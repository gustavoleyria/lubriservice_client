import Register from '../formularios/Register';
import Login from '../formularios/Login';

const Ingreso = () => {
  

  return (
    <div className="flex flex-col md:flex-row justify-center items-center">
      <div className="w-full md:w-1/2">
        <Register />
      </div>
      <div className="w-full md:w-1/2">
        <Login />
      </div>
    </div>
    
    
  );
};

export default Ingreso;


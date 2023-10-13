import './App.css'
import { UserProvider } from './components/utils/UserContexy';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from '../src/components/pages/NavBar';
import Promociones from '../src/components/pages/Promocion';
import Home from '../src/components/pages/Home';
import Footer from '../src/components/pages/Footer';
import Ingreso from '../src/components/pages/Ingreso';
import Seguimiento from './components/pages/Seguimiento';
import DetalleOrden from './components/reportes/DetalleOrden';
import Garage from './components/pages/Garaje';
import CreateTicketForm from './components/formularios/CreateTicketForm';
import Finalizar from './components/acciones/Finalizar';
import Trabajos from './components/acciones/Trabajos';
import Facturacion from './components/acciones/Facturacion';
import Comprobante from './components/reportes/Comprobante';
import Facturas from './components/reportes/Facturas';


function App() {
  

  return (
    <UserProvider>
      <BrowserRouter>

        <NavBar userRole="MANAGER"/>

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/promociones" element={<Promociones />} />
          <Route path="/ingreso" element={<Ingreso />} />
          <Route path="/seguimiento" element={<Seguimiento />} />
          <Route path="/detalleOrden/:orden" element={<DetalleOrden />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/createTicketOrden" element={<CreateTicketForm />} />
          <Route path="/trabajos/:orden" element={<Trabajos />} />
          <Route path="/finalizar/:orden" element={<Finalizar />} />
          <Route path="/facturar/:orden" element={<Facturacion />} />
          <Route path="/comprobante/:idFactura" element={<Comprobante />} />
          <Route path="/facturas" element={<Facturas />} />
          
        </Routes>

        <Footer/>

      </BrowserRouter>
    </UserProvider>
  )
}

export default App

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import BrandBar from './BrandBar'; // Importamos el BrandBar

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* LA CABECERA: Se ve en todas las pantallas de los clientes */}
      <BrandBar />
      <Navbar />
      
      {/* EL CONTENIDO DINÁMICO: 
          React Router inyecta mágicamente acá el Home, Login, etc. 
          dependiendo de la URL que visite el usuario. */}
      <main className="flex-grow">
        <Outlet /> 
      </main>

      {/* EL PIE DE PÁGINA: Se ve en todas las pantallas de los clientes */}
      <footer className="bg-nalu-dark text-white py-6 text-center text-xs uppercase tracking-widest">
        &copy; 2026 Nalu Marroquinería - Todos los derechos reservados
      </footer>
      
    </div>
  );
};
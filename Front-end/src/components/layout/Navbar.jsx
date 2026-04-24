import React from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom'; // <-- 1. Agregamos esta importación

const Navbar = () => {
  return (
    <header className="w-full bg-white shadow-xl sticky top-0 z-50">
      <div className="bg-nalu-dark py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex-1 hidden md:flex">
            <div className="relative w-full max-w-xs">
              <input 
                type="text" 
                placeholder="¿Qué estás buscando?" 
                className="w-full bg-[#3d3d3d] text-white rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-nalu-pink"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            {/* Si quieres que el logo te lleve al inicio, también podemos poner un Link aquí */}
            <Link to="/" className="text-center block hover:opacity-80 transition-opacity">
              <h1 className="text-4xl md:text-5xl font-script text-nalu-pink">
                Nalu
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                Marroquinería
              </p>
            </Link>
          </div>

          <div className="flex-1 flex justify-end items-center space-x-6 text-white">
            
            {/* <-- 2. ENVOLVEMOS EL ÍCONO DEL USUARIO EN UN LINK --> */}
            <Link to="/login" className="hover:text-nalu-pink transition-colors">
              <User className="w-5 h-5 cursor-pointer" />
            </Link>

            <div className="relative cursor-pointer group">
              <ShoppingCart className="w-5 h-5 group-hover:text-nalu-pink transition-colors" />
              <span className="absolute -top-2 -right-2 bg-nalu-pink text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex justify-center space-x-10 text-[12px] uppercase tracking-widest font-bold text-gray-600">
            <li className="hover:text-nalu-pink cursor-pointer transition-colors">Inicio</li>
            <li className="hover:text-nalu-pink cursor-pointer transition-colors">Productos</li>
            <li className="hover:text-nalu-pink cursor-pointer transition-colors">Contacto</li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
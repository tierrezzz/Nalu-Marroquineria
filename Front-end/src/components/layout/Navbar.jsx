import React from 'react';
import { Search, User, ShoppingCart, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'; 

const Navbar = () => {
  const { user, logout } = useAuth(); 
  return (
    <header className="w-full bg-white shadow-xl sticky top-0 z-50">
      <div className="bg-nalu-dark py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          
          {/* Buscador */}
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

          {/* Logo */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="text-center block hover:opacity-80 transition-opacity">
              <h1 className="text-4xl md:text-5xl font-script text-nalu-pink">Nalu</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Marroquinería</p>
            </Link>
          </div>

          {/* Sección de Usuario y Carrito */}
          <div className="flex-1 flex justify-end items-center space-x-6 text-white">
            
            {/* Lógica Dinámica: ¿Hay usuario? */}
            {user?.logged ? (
              <div className="relative group cursor-pointer flex items-center gap-2">
                <div className="flex flex-col items-end">
                   {/* Mostramos el email o nombre que viene en el Token */}
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter"></span>
                  <span className="text-xs font-bold text-nalu-pink truncate max-w-[100px]">
                    {user.email.split('@')[0]}
                  </span>
                </div>
                <User className="w-5 h-5 text-nalu-pink" />
                
                {/* Menú Desplegable al pasar el mouse */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 z-[60]">
                  <div className="p-4 border-b border-gray-50 text-nalu-dark font-bold text-sm truncate">
                    {user.email}
                  </div>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hover:text-nalu-pink transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Carrito */}
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
            <Link to="/" className="hover:text-nalu-pink cursor-pointer transition-colors">Inicio</Link>
            <li className="hover:text-nalu-pink cursor-pointer transition-colors">Productos</li>
            <li className="hover:text-nalu-pink cursor-pointer transition-colors">Contacto</li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
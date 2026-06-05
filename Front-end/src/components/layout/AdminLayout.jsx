import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 1. Agregamos el hook para navegar
  
  // 2. Traemos el user y la función logout (si la tenés definida así en tu contexto)
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Productos', path: '/admin/productos' },
    { name: 'Categorías', path: '/admin/categorias' },
  ];

  // 3. Creamos la función que se ejecuta al hacer clic
  const handleCerrarSesion = () => {
    // Si tenés una función logout en tu AuthContext, la usamos. 
    // Si no, simplemente borramos el token a mano por seguridad.
    if (logout) {
      logout();
    } else {
      localStorage.removeItem('token');
      // Si guardaste más cosas en el localStorage (como 'user'), las borramos también
      localStorage.removeItem('user'); 
    }
    
    // Lo pateamos al login
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl z-10">
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-widest text-blue-400">NALU ADMIN</h1>
        </div>

        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white font-semibold shadow-md' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          {/* 4. Le agregamos el evento onClick al botón */}
          <button 
            onClick={handleCerrarSesion}
            className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2.5 rounded-lg transition-colors font-semibold border border-red-500/50 hover:border-red-500"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">
            Panel de Control
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gray-700">Administrador</span>
              <span className="text-xs text-gray-500">{user?.email || 'Cargando...'}</span>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm cursor-pointer hover:bg-blue-700 transition-colors uppercase">
              {user?.email ? user.email.charAt(0) : 'A'}
            </div>
          </div>
        </header>

        {/* Lienzo dinámico */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
        
      </main>
    </div>
  );
};
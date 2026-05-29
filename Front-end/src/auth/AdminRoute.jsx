import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext'; 

export const AdminRoute = () => {
  // Sacamos 'isAuthenticated' porque no lo necesitamos, nos basta con 'user'
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen flex justify-center items-center">Cargando panel...</div>;

  // 1. Si el objeto 'user' no existe, lo mandamos al login
  if (!user) return <Navigate to="/login" replace />;

  // 2. Si existe, pero su rol NO es 'admin', lo pateamos a la tienda
  if (user.rol !== 'admin') return <Navigate to="/" replace />;

  // 3. Si pasó las dos pruebas, le abrimos la puerta al Panel
  return <Outlet />;
};
import { Routes, Route } from 'react-router-dom';

// 1. Importamos los dos Layouts principales
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// 2. Importamos las vistas públicas
import Home from './pages/Home';
import Login from './auth/Login';
import Register from './auth/Register';
import LoginSuccess from './pages/LoginSuccess';

// 3. Importamos las vistas del administrador
import { Dashboard } from './pages/admin/Dashboard';
import { AdminProductos } from './pages/admin/AdminProductos';
import { AdminCategorias } from './pages/admin/AdminCategorias';

// 4. Importamos el guardian de rutas para el admin
import { AdminRoute } from './auth/AdminRoute'; 

function App() {
  return (
    <Routes>
      
      {/* =========================================
          RUTAS PÚBLICAS (Usan el PublicLayout)
          ========================================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-success" element={<LoginSuccess />} />
      </Route>

      // Agregamos el guardian de rutas para el admin
      <Route element={<AdminRoute />}>

      {/* =========================================
          RUTAS DE ADMIN (Usan el AdminLayout)
          ========================================= */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="categorias" element={<AdminCategorias />} />
      </Route>
      </Route> 

    </Routes>
  );
}

export default App;
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // <-- Importamos el sistema de rutas

// Importamos tus componentes
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './auth/Login';
import Register from './auth/Register';
import LoginSuccess from './pages/LoginSuccess';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* El Navbar queda arriba de todo siempre */}
      <Navbar />
      
      {/* El contenido principal que cambia según la URL */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login-success" element={<LoginSuccess />} />
        </Routes>
      </div>

      {/* El Footer queda abajo siempre */}
      <footer className="bg-nalu-dark text-white py-6 text-center text-xs uppercase tracking-widest">
        &copy; 2026 Nalu Marroquinería - Todos los derechos reservados
      </footer>
    </div>
  );
}

export default App;
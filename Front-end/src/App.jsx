import React from 'react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Home />
      <footer className="bg-nalu-dark text-white py-6 text-center text-xs uppercase tracking-widest">
        &copy; 2026 Nalu Marroquinería - Todos los derechos reservados
      </footer>
    </div>
  );
}

export default App;
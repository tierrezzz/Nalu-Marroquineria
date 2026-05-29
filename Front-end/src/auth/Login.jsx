import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      navigate("/"); // Al home si todo sale bien
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm text-center">
        <h1 className="text-4xl font-black text-nalu-dark mb-2 uppercase tracking-tighter">
          Nalu <span className="text-nalu-pink">✦</span>
        </h1>
        <p className="text-gray-400 italic mb-8">Ingresar a mi cuenta</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-nalu-pink/20 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-nalu-pink/20 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-nalu-dark text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg">
            Iniciar Sesión
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-sm font-medium">{error}</p>}

        <div className="relative my-8 text-gray-300 uppercase text-xs tracking-widest">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
          <span className="relative bg-white px-4">o</span>
        </div>

        <button 
          onClick={() => window.location.href = 'http://localhost:3000/auth/google'}
          className="flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-50 py-4 rounded-2xl shadow-sm hover:border-nalu-pink/30 hover:bg-gray-50 transition-all font-bold text-gray-700"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="G" />
          Google
        </button>

        <footer className="mt-8 text-sm text-gray-400">
          ¿No tienes cuenta? <Link to="/register" className="text-nalu-pink font-bold hover:underline">Regístrate aquí</Link>
        </footer>
      </div>
    </div>
  );
}

export default Login;
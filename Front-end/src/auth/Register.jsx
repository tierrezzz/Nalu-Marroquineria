import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (error) setError(null);
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await register(values.email, values.password);

    if (result && result.error) {
      setError(result.error);
    } else if (result) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm text-center">
        <h1 className="text-4xl font-black text-nalu-dark mb-2 uppercase tracking-tighter">
          Nalu <span className="text-nalu-pink">✦</span>
        </h1>
        <p className="text-gray-400 italic mb-8">Crea tu cuenta</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Tu email"
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-nalu-pink/20 outline-none transition-all"
            value={values.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-nalu-pink/20 outline-none transition-all"
            value={values.password}
            onChange={handleChange}
            required
          />

          <p className="text-xs text-gray-400 text-left px-2 mt-1">
            * Debe tener al menos 8 caracteres y 1 número.
          </p>

          <button type="submit" className="w-full bg-nalu-dark text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg mt-4">
            Registrarme
          </button>
        </form>

        {error && <div className="text-red-500 mt-4 text-sm font-medium">{error}</div>}

        <footer className="mt-8 text-sm text-gray-400">
          ¿Ya tienes cuenta? <Link to="/login" className="text-nalu-pink font-bold hover:underline">Inicia sesión</Link>
        </footer>
      </div>
    </div>
  );
}

export default Register;
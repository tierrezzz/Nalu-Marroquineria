import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [values, setValues] = useState({
    username: "",
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

    const result = await register(values.username, values.email, values.password);

    if (result.error) {
      setError(result.error);
    } else {
      // Registro exitoso: lo mandamos al login para que entre
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm text-center">
        <h1 className="text-4xl font-black text-nalu-dark mb-2 uppercase tracking-tighter">
          Nalu <span className="text-nalu-pink">✦</span>
        </h1>
        <h2 className="text-xl font-bold text-gray-800 mb-6 italic">Crear tu cuenta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Nombre de Usuario"
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-nalu-pink/20 outline-none transition-all"
            value={values.username}
            onChange={handleChange}
            required
          />

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
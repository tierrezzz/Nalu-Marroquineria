import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRouter({ children }) {
  const { user, loading } = useAuth();

  // Mientras se verifica el token en el localStorage al cargar la página
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nalu-pink"></div>
      </div>
    );
  }

  // Si no hay usuario logueado en el Contexto, redirige al login
  if (!user || !user.logged) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Recargamos la página al home para que el Context detecte el token nuevo
      window.location.href = "/";
    } else {
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <p className="animate-pulse font-bold text-nalu-dark text-xl">Sincronizando con Google...</p>
    </div>
  );
};

export default LoginSuccess;
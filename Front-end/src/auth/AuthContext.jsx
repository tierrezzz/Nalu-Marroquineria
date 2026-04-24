import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:3000";
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Verificamos si expiró
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            logout();
          } else {
            // Seteamos el usuario con la info REAL del token (email, rol, etc)
            setUser({ ...decoded, logged: true });
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return { error: data.error || "Fallo el inicio de sesión" };

    localStorage.setItem("token", data.token);
    const decoded = jwtDecode(data.token);
    setUser({ ...decoded, logged: true });
    
    return data;
  };

  // Esta función es nueva: la usará LoginSuccess para Google
  const loginWithGoogle = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser({ ...decoded, logged: true });
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginWithGoogle, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
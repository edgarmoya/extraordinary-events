import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Paths from "../routes/Paths";

export const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);

  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  let loginUser = async (username, password) => {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: username,
        password: password,
      }),
    });

    let data = await response.json();

    if (data) {
      localStorage.setItem("authTokens", JSON.stringify(data));
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
    } else {
      throw new Error("Error de autenticación");
    }
  };

  const updateToken = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });

    const data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  let logoutUser = () => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    navigate(Paths.LOGIN);
  };

  let contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
  };

  const isAccessTokenExpired = (accessToken) => {
    try {
      const decodedToken = jwtDecode(accessToken);
      return decodedToken.exp < Date.now() / 1000;
    } catch (err) {
      return true; // Token is invalid or expired
    }
  };

  useEffect(() => {
    const REFRESH_INTERVAL = 1000 * 60 * 55; // 55 minutes

    const checkTokenExpirationAndRefresh = () => {
      if (authTokens && isAccessTokenExpired(authTokens.access)) {
        updateToken();
      }
    };

    checkTokenExpirationAndRefresh();

    // Configurar un intervalo para verificar y actualizar el token cada 4 minutos
    const interval = setInterval(() => {
      checkTokenExpirationAndRefresh();
    }, REFRESH_INTERVAL);

    // Limpiar el intervalo cuando el componente se desmonta o cuando authTokens cambia
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

import { createContext, useState, useEffect, useCallback } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Paths from "../routes/Paths";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const loginUser = async (username, password) => {
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

    if (!response.ok) {
      throw new Error("Error de autenticación");
    }

    let data = await response.json();
    localStorage.setItem("authTokens", JSON.stringify(data));
    setAuthTokens(data);
    setUser(jwtDecode(data.access));
  };

  const logoutUser = useCallback(() => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    navigate(Paths.LOGIN);
  }, [navigate]);

  const updateToken = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      });

      if (!response.ok) {
        logoutUser();
        return;
      }

      const data = await response.json();
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } catch (error) {
      console.error("Error updating token: ", error);
      logoutUser();
    }
  }, [authTokens, logoutUser]);

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
    const REFRESH_INTERVAL = 1000 * 60 * 4; // 60 minutes

    const checkTokenExpirationAndRefresh = () => {
      if (authTokens && isAccessTokenExpired(authTokens.access)) {
        updateToken();
      }
    };

    // Configurar un intervalo para verificar y actualizar el token cada 4 minutos
    const interval = setInterval(() => {
      checkTokenExpirationAndRefresh();
    }, REFRESH_INTERVAL);

    // Limpiar el intervalo cuando el componente se desmonta o cuando authTokens cambia
    return () => clearInterval(interval);
  }, [authTokens, updateToken]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;

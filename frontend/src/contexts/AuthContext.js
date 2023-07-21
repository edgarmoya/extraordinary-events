import { createContext, useState, useEffect, useCallback } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Paths from "../routes/Paths";

const AUTH_TOKEN = "authTokens";
export const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [authTokens, setAuthTokens] = useState(
    () => JSON.parse(localStorage.getItem(AUTH_TOKEN)) || null
  );

  const [user, setUser] = useState(() =>
    authTokens ? jwt_decode(authTokens.access) : null
  );

  const loginUser = async (username, password) => {
    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: username,
          password: password,
        }),
      });
      const data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem(AUTH_TOKEN, JSON.stringify(data));
        navigate(Paths.EVENTS);
      } else {
        throw new Error("Error de autenticación");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      throw new Error("Credenciales incorrectas");
    }
  };

  const logoutUser = useCallback(() => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN);
    navigate(Paths.LOGIN);
  }, [navigate]);

  const updateToken = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem(AUTH_TOKEN, JSON.stringify(data));
      } else {
        logoutUser();
      }

      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating token:", error);
      throw new Error("Error updating token");
    }
  }, [authTokens?.refresh, loading, logoutUser]);

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const fourMinutes = 1000 * 60 * 4;
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);

    return () => clearInterval(interval);
  }, [authTokens, loading, updateToken]);

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

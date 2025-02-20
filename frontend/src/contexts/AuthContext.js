import { createContext, useState } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Paths from "../routes/Paths";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const ACCESS_TOKEN = "access_token";
  const REFRESH_TOKEN = "refresh_token";
  const navigate = useNavigate();

  const [user, setUser] = useState(
    localStorage.getItem(ACCESS_TOKEN)
      ? jwtDecode(localStorage.getItem(ACCESS_TOKEN))
      : null
  );

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(ACCESS_TOKEN)
      ? localStorage.getItem(ACCESS_TOKEN)
      : null
  );

  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/token/",
        credentials
      );
      const { access, refresh } = response.data;

      setAccessToken(access);
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);

      setUser(jwtDecode(access));
    } catch (error) {
      throw new Error("Error de autenticación");
    }
  };

  const logoutUser = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate(Paths.LOGIN);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

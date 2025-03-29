import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Paths from "../routes/Paths";
import useFetchData from "../hooks/useFetchData";
import UserService from "../api/users.api";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const ACCESS_TOKEN = "access_token";
  const REFRESH_TOKEN = "refresh_token";
  const navigate = useNavigate();

  const [groupsInfo, setGroupsInfo] = useState(null);
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
      const response = await axios.post(`${API_URL}/api/token/`, credentials);
      const { access, refresh } = response.data;

      setAccessToken(access);
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);

      setUser(jwtDecode(access));
    } catch (error) {
      throw new Error("Error de autenticación");
    }
  };

  // Función para roles
  const { data } = useFetchData(
    user?.user_id ? UserService.getUserGroups : null,
    [user?.user_id],
    [user]
  );

  useEffect(() => {
    if (data) {
      setGroupsInfo(data);
    }
  }, [data]);

  const logoutUser = () => {
    setAccessToken(null);
    setUser(null);
    setGroupsInfo(null);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate(Paths.LOGIN);
  };

  return (
    <AuthContext.Provider
      value={{ user, groupsInfo, accessToken, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

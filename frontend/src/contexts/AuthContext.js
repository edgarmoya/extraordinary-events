import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Paths from "../routes/Paths";
import useFetchData from "../hooks/useFetchData";
import UserService from "../api/users.api";
import { showErrorToast, showLoginToast } from "../utils/toastUtils";

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

  const loginUser = async (
    credentials,
    setLoading,
    setStatusMessage,
    setChangePassword,
    setUserId
  ) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/token/`, credentials);

      setStatusMessage("Verificando credenciales...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!response || !response.data) {
        throw new Error(
          "No se pudo iniciar sesión. Respuesta vacía del servidor."
        );
      }

      const { access, refresh, first_login, user_id } = response.data;

      setAccessToken(access);
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);

      if (first_login) {
        setUserId(user_id);
        setChangePassword(true);
        showErrorToast("Debe cambiar su contraseña antes de iniciar sesión");
      } else {
        setStatusMessage("Iniciando sesión...");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setUser(jwtDecode(access));
        navigate(`${Paths.HOME}`);
        showLoginToast(jwtDecode(access).username);
      }
    } catch (error) {
      const detail = error?.response?.data?.detail;
      throw new Error(
        detail || "No se pudo iniciar sesión. Error al conectarse al servidor."
      );
    } finally {
      setLoading(false);
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

  const logoutUser = async () => {
    try {
      await UserService.logout();
    } catch (error) {
      console.warn("Error al cerrar sesión en el backend:", error);
    } finally {
      setAccessToken(null);
      setUser(null);
      setGroupsInfo(null);
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      navigate(Paths.LOGIN);
    }
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

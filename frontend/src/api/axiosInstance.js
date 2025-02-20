import axios from "axios";
import jwtDecode from "jwt-decode";

// Base URL para la API
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Refrescar el token de acceso
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (refreshToken) {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/token/refresh/",
        {
          refresh: refreshToken,
        }
      );
      const { access } = response.data;
      localStorage.setItem("access_token", access);
      return access;
    } catch (error) {
      console.error("Error refreshing token:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login"; // Redirige al login si falla
    }
  }
};

// Interceptor de solicitud para agregar el token de acceso
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      // Refrescar token si está próximo a expirar
      if (decodedToken.exp - currentTime < 300) {
        const newAccessToken = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login"; // Redirige al login en caso de 401
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

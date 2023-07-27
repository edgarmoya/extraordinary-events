import axios from "axios";

const userAPI = axios.create({
  baseURL: "http://localhost:8000/api/users",
});

const createHeaders = (authTokens) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + String(authTokens.access),
});

const UserService = {
  getUser: async (authTokens, id) => {
    return userAPI.get(`/${id}/`, {
      headers: createHeaders(authTokens),
    });
  },

  getUserGroups: async (authTokens, idUser) => {
    return userAPI.get(`/${idUser}/groups/`, {
      headers: createHeaders(authTokens),
    });
  },

  changePassword: async (authTokens, idUser, oldPassword, newPassword) => {
    const requestData = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    try {
      const response = await userAPI.post(
        `/${idUser}/change_password/`,
        requestData,
        {
          headers: createHeaders(authTokens),
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        "Error al cambiar la contraseña: " + error.response.data.detail
      );
    }
  },
};

export default UserService;

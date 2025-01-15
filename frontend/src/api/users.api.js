import axiosInstance from "./axiosInstance";

const UserService = {
  getUser: async (id) => {
    return axiosInstance.get(`/users/${id}/`);
  },

  getUserGroups: async (idUser) => {
    return axiosInstance.get(`/users/${idUser}/groups/`);
  },

  changePassword: async (idUser, oldPassword, newPassword) => {
    const requestData = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    try {
      const response = await axiosInstance.post(
        `/users/${idUser}/change_password/`,
        requestData
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

import axiosInstance from "./axiosInstance";

const UserService = {
  getUser: async (id) => {
    return axiosInstance.get(`/users/${id}/`);
  },

  getUsers: async (page, searchTerm, isActive) => {
    return axiosInstance.get(`/users/`, {
      params: {
        page: page,
        search: searchTerm,
        is_active: isActive,
      },
    });
  },

  addUser: async (user) => {
    return axiosInstance.post(`/users/`, user);
  },

  updateUser: async (data) => {
    const { id, ...user } = data;
    return axiosInstance.put(`/users/${id}/`, user);
  },

  activateUser: async (user) => {
    const { id, activated } = user;
    return axiosInstance.patch(`/users/${id}/`, { is_active: !activated });
  },

  deleteUser: async (idUser) => {
    return axiosInstance.delete(`/users/${idUser}/`);
  },

  getUserGroups: async (idUser) => {
    return axiosInstance.get(`/users/${idUser}/roles/`);
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

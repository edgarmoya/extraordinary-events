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

  activateUser: async (data) => {
    const { id, activated } = data;
    return axiosInstance.patch(`/users/${id}/`, { is_active: !activated });
  },

  deleteUser: async (idUser) => {
    return axiosInstance.delete(`/users/${idUser}/`);
  },

  getUserGroups: async (idUser) => {
    return axiosInstance.get(`/users/${idUser}/roles/`);
  },

  changePassword: async (data) => {
    const { id, ...user } = data;
    return axiosInstance.post(`/users/${id}/change-password/`, user);
  },

  updateRoles: async (data) => {
    const { id, roles } = data;
    return axiosInstance.put(`/users/${id}/update-roles/`, roles);
  },
};

export default UserService;

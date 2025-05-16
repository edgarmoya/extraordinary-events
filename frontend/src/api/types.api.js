import axiosInstance from "./axiosInstance";

const TypeService = {
  getTypes: async (page, searchTerm, is_active) => {
    return axiosInstance.get(`/types/`, {
      params: {
        page: page,
        search: searchTerm,
        is_active: is_active,
      },
    });
  },

  addType: async (type) => {
    return axiosInstance.post(`/types/`, type);
  },

  deleteType: async (id) => {
    return axiosInstance.delete(`/types/${id}/`);
  },

  updateType: async (data) => {
    const { id, ...type } = data;
    return axiosInstance.put(`/types/${id}/`, type);
  },

  activateType: async (data) => {
    const { id, activated } = data;
    return axiosInstance.patch(`/types/${id}/`, { is_active: !activated });
  },
};

export default TypeService;

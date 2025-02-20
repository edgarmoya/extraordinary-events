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

  updateType: async (id, type) => {
    return axiosInstance.put(`/types/${id}/`, type);
  },

  activateType: async (id, activated) => {
    return axiosInstance.patch(`/types/${id}/`, { is_active: !activated });
  },
};

export default TypeService;

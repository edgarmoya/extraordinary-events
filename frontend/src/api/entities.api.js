import axiosInstance from "./axiosInstance";

const EntityService = {
  getEntities: async (page, searchTerm, is_active) => {
    return axiosInstance.get(`/entities/`, {
      params: {
        page: page,
        search: searchTerm,
        is_active: is_active,
      },
    });
  },

  addEntity: async (entity) => {
    return axiosInstance.post(`/entities/`, entity);
  },

  deleteEntity: async (id) => {
    return axiosInstance.delete(`/entities/${id}/`);
  },

  updateEntity: async (id, entity) => {
    return axiosInstance.put(`/entities/${id}/`, entity);
  },

  activateEntity: async (id, activated) => {
    return axiosInstance.patch(`/entities/${id}/`, { is_active: !activated });
  },
};

export default EntityService;

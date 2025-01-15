import axiosInstance from "./axiosInstance";

const EntityService = {
  getEntities: async (page, searchTerm) => {
    return axiosInstance.get(`/entities/`, {
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getActiveEntities: async (page, searchTerm) => {
    return axiosInstance.get(`/active-entities/`, {
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getInactiveEntities: async (page, searchTerm) => {
    return axiosInstance.get(`/inactive-entities/`, {
      params: {
        page: page,
        search: searchTerm,
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

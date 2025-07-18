import axiosInstance from "./axiosInstance";

const EntityService = {
  getEntities: async (page, searchTerm, isActive, roles) => {
    return axiosInstance.get(`/entities/`, {
      params: {
        page: page,
        search: searchTerm,
        ...(isActive !== undefined && { is_active: isActive }),
        ...(roles && { roles }),
      },
    });
  },

  addEntity: async (entity) => {
    return axiosInstance.post(`/entities/`, entity);
  },

  deleteEntity: async (idEntity) => {
    return axiosInstance.delete(`/entities/${idEntity}/`);
  },

  updateEntity: async (data) => {
    const { id, ...entity } = data;
    return axiosInstance.put(`/entities/${id}/`, entity);
  },

  activateEntity: async (data) => {
    const { id, activated } = data;
    return axiosInstance.patch(`/entities/${id}/`, { is_active: !activated });
  },
};

export default EntityService;

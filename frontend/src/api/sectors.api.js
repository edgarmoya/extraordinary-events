import axiosInstance from "./axiosInstance";

const SectorService = {
  getSectors: async (page, searchTerm, isActive) => {
    return axiosInstance.get(`/sectors/`, {
      params: {
        page: page,
        search: searchTerm,
        is_active: isActive,
      },
    });
  },

  addSector: async (sector) => {
    return axiosInstance.post(`/sectors/`, sector);
  },

  deleteSector: async (idSector) => {
    return axiosInstance.delete(`/sectors/${idSector}/`);
  },

  updateSector: async (data) => {
    const { id, ...sector } = data;
    return axiosInstance.put(`/sectors/${id}/`, sector);
  },

  activateSector: async (data) => {
    const { id, activated } = data;
    return axiosInstance.patch(`/sectors/${id}/`, { is_active: !activated });
  },
};

export default SectorService;

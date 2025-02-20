import axiosInstance from "./axiosInstance";

const SectorService = {
  getSectors: async (page, searchTerm, is_active) => {
    return axiosInstance.get(`/sectors/`, {
      params: {
        page: page,
        search: searchTerm,
        is_active: is_active,
      },
    });
  },

  addSector: async (sector) => {
    return axiosInstance.post(`/sectors/`, sector);
  },

  deleteSector: async (id) => {
    return axiosInstance.delete(`/sectors/${id}/`);
  },

  updateSector: async (id, sector) => {
    return axiosInstance.put(`/sectors/${id}/`, sector);
  },

  activateSector: async (id, activated) => {
    return axiosInstance.patch(`/sectors/${id}/`, { is_active: !activated });
  },
};

export default SectorService;

import axiosInstance from "./axiosInstance";

const SectorService = {
  getSectors: async (page, searchTerm) => {
    return axiosInstance.get(`/sectors/`, {
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getActiveSectors: async (page, searchTerm) => {
    return axiosInstance.get(`/active-sectors/`, {
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getInactiveSectors: async (page, searchTerm) => {
    return axiosInstance.get(`/inactive-sectors/`, {
      params: {
        page: page,
        search: searchTerm,
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

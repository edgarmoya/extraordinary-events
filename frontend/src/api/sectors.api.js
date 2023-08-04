import axios from "axios";

const sectorsAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});

const createHeaders = (authTokens) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + String(authTokens.access),
});

const SectorsService = {
  getSectors: async (authTokens, page, searchTerm) => {
    return sectorsAPI.get(`/sectors/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getActiveSectors: async (authTokens, page, searchTerm) => {
    return sectorsAPI.get(`/active-sectors/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getInactiveSectors: async (authTokens, page, searchTerm) => {
    return sectorsAPI.get(`/inactive-sectors/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  addSector: async (authTokens, sector) => {
    return sectorsAPI.post(`/sectors/`, sector, {
      headers: createHeaders(authTokens),
    });
  },

  deleteSector: async (authTokens, id) => {
    return sectorsAPI.delete(`/sectors/${id}/`, {
      headers: createHeaders(authTokens),
    });
  },

  updateSector: async (authTokens, id, sector) => {
    return sectorsAPI.put(`/sectors/${id}/`, sector, {
      headers: createHeaders(authTokens),
    });
  },

  activateSector: async (authTokens, id, activated) => {
    return sectorsAPI.patch(
      `/sectors/${id}/`,
      { is_active: !activated },
      {
        headers: createHeaders(authTokens),
      }
    );
  },
};

export default SectorsService;

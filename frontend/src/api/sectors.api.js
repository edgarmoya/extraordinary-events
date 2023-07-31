import axios from "axios";

const sectorsAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});

const createHeaders = (authTokens) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + String(authTokens.access),
});

const SectorsService = {
  getSectors: async (authTokens, page) => {
    return sectorsAPI.get(`/sectors/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
      },
    });
  },

  getActiveSectors: async (authTokens, page) => {
    return sectorsAPI.get(`/active-sectors/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
      },
    });
  },

  getInactiveSectors: async (authTokens, page) => {
    return sectorsAPI.get(`/inactive-sectors/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
      },
    });
  },

  addSector: async (authTokens, sector) => {
    return sectorsAPI.post(`/sectors/`, sector, {
      headers: createHeaders(authTokens),
    });
  },
};

export default SectorsService;

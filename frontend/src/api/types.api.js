import axios from "axios";

const typesAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});

const createHeaders = (authTokens) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + String(authTokens.access),
});

const TypeService = {
  getTypes: async (authTokens, page, searchTerm) => {
    return typesAPI.get(`/types/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getActiveTypes: async (authTokens, page, searchTerm) => {
    return typesAPI.get(`/active-types/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getInactiveTypes: async (authTokens, page, searchTerm) => {
    return typesAPI.get(`/inactive-types/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  addType: async (authTokens, type) => {
    return typesAPI.post(`/types/`, type, {
      headers: createHeaders(authTokens),
    });
  },

  deleteType: async (authTokens, id) => {
    return typesAPI.delete(`/types/${id}/`, {
      headers: createHeaders(authTokens),
    });
  },

  updateType: async (authTokens, id, type) => {
    return typesAPI.put(`/types/${id}/`, type, {
      headers: createHeaders(authTokens),
    });
  },

  activateType: async (authTokens, id, activated) => {
    return typesAPI.patch(
      `/types/${id}/`,
      { is_active: !activated },
      {
        headers: createHeaders(authTokens),
      }
    );
  },
};

export default TypeService;

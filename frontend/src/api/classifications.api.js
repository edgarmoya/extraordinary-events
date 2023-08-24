import axios from "axios";

const classificationsAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});

const createHeaders = (authTokens) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + String(authTokens.access),
});

const ClassificationService = {
  getClassifications: async (authTokens, page, searchTerm) => {
    return classificationsAPI.get(`/classifications/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getActiveClassifications: async (authTokens, page, searchTerm) => {
    return classificationsAPI.get(`/active-classifications/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getInactiveClassifications: async (authTokens, page, searchTerm) => {
    return classificationsAPI.get(`/inactive-classifications/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  addClassification: async (authTokens, classification) => {
    return classificationsAPI.post(`/classifications/`, classification, {
      headers: createHeaders(authTokens),
    });
  },

  deleteClassification: async (authTokens, id) => {
    return classificationsAPI.delete(`/classifications/${id}/`, {
      headers: createHeaders(authTokens),
    });
  },

  updateClassification: async (authTokens, id, classification) => {
    return classificationsAPI.put(`/classifications/${id}/`, classification, {
      headers: createHeaders(authTokens),
    });
  },

  activateClassification: async (authTokens, id, activated) => {
    return classificationsAPI.patch(
      `/classifications/${id}/`,
      { is_active: !activated },
      {
        headers: createHeaders(authTokens),
      }
    );
  },
};

export default ClassificationService;

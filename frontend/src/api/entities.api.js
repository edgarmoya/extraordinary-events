import axios from "axios";

const entitiesAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});

const createHeaders = (authTokens) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + String(authTokens.access),
});

const EntityService = {
  getEntities: async (authTokens, page, searchTerm) => {
    return entitiesAPI.get(`/entities/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getActiveEntities: async (authTokens, page, searchTerm) => {
    return entitiesAPI.get(`/active-entities/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getInactiveEntities: async (authTokens, page, searchTerm) => {
    return entitiesAPI.get(`/inactive-entities/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  addEntity: async (authTokens, entity) => {
    return entitiesAPI.post(`/entities/`, entity, {
      headers: createHeaders(authTokens),
    });
  },

  deleteEntity: async (authTokens, id) => {
    return entitiesAPI.delete(`/entities/${id}/`, {
      headers: createHeaders(authTokens),
    });
  },

  updateEntity: async (authTokens, id, entity) => {
    return entitiesAPI.put(`/entities/${id}/`, entity, {
      headers: createHeaders(authTokens),
    });
  },

  activateEntity: async (authTokens, id, activated) => {
    return entitiesAPI.patch(
      `/entities/${id}/`,
      { is_active: !activated },
      {
        headers: createHeaders(authTokens),
      }
    );
  },
};

export default EntityService;

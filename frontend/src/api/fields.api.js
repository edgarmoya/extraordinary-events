import axiosInstance from "./axiosInstance";

const FieldService = {
  getFields: async (page, searchTerm, is_active) => {
    return axiosInstance.get(`/addfields/`, {
      params: {
        page: page,
        search: searchTerm,
        is_active: is_active,
      },
    });
  },

  addField: async (field) => {
    return axiosInstance.post(`/addfields/`, field);
  },

  deleteField: async (id) => {
    return axiosInstance.delete(`/addfields/${id}/`);
  },

  updateField: async (id, field) => {
    return axiosInstance.put(`/addfields/${id}/`, field);
  },

  activateField: async (id, activated) => {
    return axiosInstance.patch(`/addfields/${id}/`, { is_active: !activated });
  },

  getFieldValues: async (event_id) => {
    return axiosInstance.get(`/fieldvalue/`, {
      params: {
        event_id: event_id,
      },
    });
  },

  addFieldValue: async (field_value) => {
    return axiosInstance.post(`/fieldvalue/`, field_value);
  },

  deleteFieldValue: async (id) => {
    return axiosInstance.delete(`/fieldvalue/${id}`);
  },
};

export default FieldService;

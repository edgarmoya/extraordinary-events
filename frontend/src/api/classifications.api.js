import axiosInstance from "./axiosInstance";

const ClassificationService = {
  getClassifications: async (page, searchTerm) => {
    return axiosInstance.get(`/classifications/`, {
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getActiveClassifications: async (page, searchTerm) => {
    return axiosInstance.get(`/active-classifications/`, {
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getInactiveClassifications: async (page, searchTerm) => {
    return axiosInstance.get(`/inactive-classifications/`, {
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  addClassification: async (classification) => {
    return axiosInstance.post(`/classifications/`, classification);
  },

  deleteClassification: async (id) => {
    return axiosInstance.delete(`/classifications/${id}/`);
  },

  updateClassification: async (id, classification) => {
    return axiosInstance.put(`/classifications/${id}/`, classification);
  },

  activateClassification: async (id, activated) => {
    return axiosInstance.patch(`/classifications/${id}/`, {
      is_active: !activated,
    });
  },
};

export default ClassificationService;

import axiosInstance from "./axiosInstance";

const ClassificationService = {
  getClassifications: async (page, searchTerm, is_active) => {
    return axiosInstance.get(`/classifications/`, {
      params: {
        page: page,
        search: searchTerm,
        is_active: is_active,
      },
    });
  },

  addClassification: async (classification) => {
    return axiosInstance.post(`/classifications/`, classification);
  },

  deleteClassification: async (id) => {
    return axiosInstance.delete(`/classifications/${id}/`);
  },

  updateClassification: async (data) => {
    const { id, ...classification } = data;
    return axiosInstance.put(`/classifications/${id}/`, classification);
  },

  activateClassification: async (data) => {
    const { id, activated } = data;
    return axiosInstance.patch(`/classifications/${id}/`, {
      is_active: !activated,
    });
  },
};

export default ClassificationService;

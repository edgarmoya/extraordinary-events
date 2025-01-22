import axiosInstance from "./axiosInstance";

const LocationService = {
  getProvinces: async () => {
    return axiosInstance.get(`/province/`, {});
  },

  getMunicipalities: async (province) => {
    return axiosInstance.get(`/municipality/`, {
      params: {
        id_province: province,
      },
    });
  },
};

export default LocationService;

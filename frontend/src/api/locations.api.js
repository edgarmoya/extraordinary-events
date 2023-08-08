import axios from "axios";

const locationsAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});

const createHeaders = (authTokens) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + String(authTokens.access),
});

const LocationService = {
  getProvinces: async (authTokens) => {
    return locationsAPI.get(`/province/`, {
      headers: createHeaders(authTokens),
    });
  },

  getMunicipalities: async (authTokens, province) => {
    return locationsAPI.get(`/municipality/`, {
      headers: createHeaders(authTokens),
      params: {
        id_province: province,
      },
    });
  },
};

export default LocationService;

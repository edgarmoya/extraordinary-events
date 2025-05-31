import axiosInstance from "./axiosInstance";

const AiService = {
  ask: async (eventId) => {
    return axiosInstance.get(`/ask/`, {
      params: {
        id: eventId,
      },
    });
  },
};

export default AiService;

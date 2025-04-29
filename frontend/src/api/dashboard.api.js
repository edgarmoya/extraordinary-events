import axiosInstance from "./axiosInstance";

const DashboardService = {
  getEventsCount: async () => {
    return axiosInstance.get(`/events_count/`);
  },

  getEventsCountByProvince: async (province_id) => {
    return axiosInstance.get(`/events_count_by_province/${province_id}/`);
  },

  getPercentageBySector: async () => {
    return axiosInstance.get(`/percentage_of_events_by_sector/`);
  },

  getEventsCountScope: async () => {
    return axiosInstance.get(`/events_count_scope/`);
  },

  getEventsCountByType: async () => {
    return axiosInstance.get(`/events_count_by_type/`);
  },
};

export default DashboardService;

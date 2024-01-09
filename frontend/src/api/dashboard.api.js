import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

const DashboardService = {
  getEventCounts: async () => {
    return API.get(`/event_counts/`);
  },

  getEventsCountByProvince: async (province_name) => {
    return API.get(`/events_count_by_province/${province_name}/`);
  },

  getPercentageBySector: async () => {
    return API.get(`/percentage_of_events_by_sector/`);
  },

  getEventsCountScope: async () => {
    return API.get(`/events_count_scope/`);
  },

  getEventsCountByType: async () => {
    return API.get(`/events_count_by_type/`);
  },
};

export default DashboardService;

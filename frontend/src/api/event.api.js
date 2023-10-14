import axios from "axios";

const eventsAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});

const createHeaders = (authTokens) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + String(authTokens.access),
});

const EventService = {
  getEvents: async (authTokens, page, searchTerm) => {
    return eventsAPI.get(`/events/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getOpenEvents: async (authTokens, page, searchTerm) => {
    return eventsAPI.get(`/open-events/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  getCloseEvents: async (authTokens, page, searchTerm) => {
    return eventsAPI.get(`/closed-events/`, {
      headers: createHeaders(authTokens),
      params: {
        page: page,
        search: searchTerm,
      },
    });
  },

  addEvent: async (authTokens, event) => {
    return eventsAPI.post(`/events/`, event, {
      headers: createHeaders(authTokens),
    });
  },

  deleteEvent: async (authTokens, id) => {
    return eventsAPI.delete(`/events/${id}/`, {
      headers: createHeaders(authTokens),
    });
  },

  updateEvent: async (authTokens, id, event) => {
    return eventsAPI.put(`/events/${id}/`, event, {
      headers: createHeaders(authTokens),
    });
  },

  closeEvent: async (authTokens, id, user, date) => {
    return eventsAPI.patch(
      `/events/${id}/`,
      { closed_by: user, closed_date: date, status: "closed" },
      {
        headers: createHeaders(authTokens),
      }
    );
  },
};

export default EventService;

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

  /* MEASURES */
  getMeasures: async (authTokens, id) => {
    return eventsAPI.get(`/measures/`, {
      headers: createHeaders(authTokens),
      params: {
        event_id: id,
      },
    });
  },

  addMeasure: async (authTokens, measure) => {
    return eventsAPI.post(`/measures/`, measure, {
      headers: createHeaders(authTokens),
    });
  },

  deleteMeasure: async (authTokens, id) => {
    return eventsAPI.delete(`/measures/${id}/`, {
      headers: createHeaders(authTokens),
    });
  },

  /* ATTACHMENTS */
  getAttachments: async (authTokens, id) => {
    return eventsAPI.get(`/attachments/`, {
      headers: createHeaders(authTokens),
      params: {
        event_id: id,
      },
    });
  },

  addAttachment: async (authTokens, attachment) => {
    try {
      const response = await eventsAPI.post("/attachments/", attachment, {
        headers: {
          ...createHeaders(authTokens),
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAttachment: async (authTokens, id) => {
    return eventsAPI.delete(`/attachments/${id}/`, {
      headers: {
        ...createHeaders(authTokens),
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default EventService;

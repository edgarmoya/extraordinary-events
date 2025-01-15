import axiosInstance from "./axiosInstance";

const EventService = {
  getEvents: async (page, searchTerm, status) => {
    return axiosInstance.get(`/events/`, {
      params: {
        page: page,
        search: searchTerm,
        status: status,
      },
    });
  },

  addEvent: async (event) => {
    return axiosInstance.post(`/events/`, event);
  },

  deleteEvent: async (id) => {
    return axiosInstance.delete(`/events/${id}/`);
  },

  updateEvent: async (id, event) => {
    return axiosInstance.put(`/events/${id}/`, event);
  },

  closeEvent: async (id, user, date) => {
    return axiosInstance.patch(`/events/${id}/`, {
      closed_by: user,
      closed_date: date,
      status: "closed",
    });
  },

  /* MEASURES */
  getMeasures: async (id) => {
    return axiosInstance.get(`/measures/`, {
      params: {
        event_id: id,
      },
    });
  },

  addMeasure: async (measure) => {
    return axiosInstance.post(`/measures/`, measure);
  },

  deleteMeasure: async (id) => {
    return axiosInstance.delete(`/measures/${id}/`);
  },

  /* ATTACHMENTS */
  getAttachments: async (id) => {
    return axiosInstance.get(`/attachments/`, {
      params: {
        event_id: id,
      },
    });
  },

  addAttachment: async (attachment) => {
    try {
      const response = await axiosInstance.post("/attachments/", attachment, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAttachment: async (id) => {
    return axiosInstance.delete(`/attachments/${id}/`, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default EventService;

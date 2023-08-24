import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

const createHeaders = (authTokens) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + String(authTokens.access),
});

const GradeService = {
  getGrades: async (authTokens) => {
    return api.get(`/grades/`, {
      headers: createHeaders(authTokens),
    });
  },
};

export default GradeService;

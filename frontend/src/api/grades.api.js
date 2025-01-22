import axiosInstance from "./axiosInstance";

const GradeService = {
  getGrades: async () => {
    return axiosInstance.get(`/grades/`, {});
  },
};

export default GradeService;

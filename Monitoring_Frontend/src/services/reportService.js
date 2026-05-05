import api from "./api";

export const getReports = async (params = {}) => {
  const response = await api.get("/reports", { params });
  return response.data;
};
export const getManagerReports = async () => {
  const response = await api.get("/reports/manager");
  return response.data;
};
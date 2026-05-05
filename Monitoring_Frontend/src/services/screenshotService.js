import api from "./api";

export const getScreenshots = async (params = {}) => {
  const response = await api.get("/screenshots", { params });
  return response.data;
};
import api from "./api";

export const getAdminSummary = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data;
};
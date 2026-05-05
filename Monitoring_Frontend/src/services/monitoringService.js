import api from "./api";

export const getMonitoringData = async (params = {}) => {
  const res = await api.get("/activity/live-status", { params });
  return res.data;
};
import api from "./api";

export const assignEmployee = (data) =>
  api.post("/team-mappings", data);

export const getMappingsByTeamLead = (teamLeadId) =>
  api.get(`/team-mappings/team-lead/${teamLeadId}`);

export const deleteMapping = (id) =>
  api.delete(`/team-mappings/${id}`);
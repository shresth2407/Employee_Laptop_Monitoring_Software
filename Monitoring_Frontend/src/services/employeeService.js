import api from "./api.js";


// ================= DASHBOARD =================
export const getDashboardData = () => {
  return api.get("/employee/dashboard");
};

export const getStats = () => {
  return api.get("/employee/stats");
};


// ================= SESSION =================

// 🔥 start session
export const startSession = () => {
  return api.post("/session/my/start");
};

// 🔥 get active session
export const getActiveSession = () => {
  return api.get("/session/my/current");
};

// 🔥 end session
export const endSession = () => {
  return api.post("/session/my/end");
};


// ================= WORK (alias - UI use) =================

// 👉 same API, different naming (UI friendly)
export const startWork = startSession;
export const stopWork = endSession;


// ================= PROFILE =================

export const getProfile = () => {
  return api.get("/employee/profile");
};

export const updateProfile = (data) => {
  return api.put("/employee/profile", data);
};

export const changePassword = (data) => {
  return api.put("/employee/change-password", data);
};


// ================= ADMIN USERS =================

export const getEmployees = (params = {}) => {
  return api.get("/users", { params });
};

export const getEmployeeById = (id) => {
  return api.get(`/users/${id}`);
};

export const createEmployee = (data) => {
  return api.post("/users", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateEmployee = (id, data) => {
  return api.put(`/users/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteEmployee = (id) => {
  return api.delete(`/users/${id}`);
};

export const updateEmployeeStatus = (id, isActive) => {
  return api.patch(`/users/${id}/${isActive ? "activate" : "deactivate"}`);
};
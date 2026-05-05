import Department from "./department.model.js";

export const createDepartment = async (payload) => {
  return await Department.create(payload);
};

export const listDepartments = async () => {
  return await Department.find().sort({ createdAt: -1 });
};

export const updateDepartment = async (id, payload) => {
  const department = await Department.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!department) {
    const error = new Error("Department not found");
    error.statusCode = 404;
    throw error;
  }

  return department;
};
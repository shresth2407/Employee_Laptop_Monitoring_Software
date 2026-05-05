import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import {
  createDepartment,
  listDepartments,
  updateDepartment,
} from "./department.service.js";

export const create = asyncHandler(async (req, res) => {
  const department = await createDepartment(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Department created successfully",
    data: department,
  });
});

export const list = asyncHandler(async (req, res) => {
  const departments = await listDepartments();

  return sendSuccess(res, {
    message: "Departments fetched successfully",
    data: departments,
  });
});

export const update = asyncHandler(async (req, res) => {
  const department = await updateDepartment(req.params.id, req.body);

  return sendSuccess(res, {
    message: "Department updated successfully",
    data: department,
  });
});
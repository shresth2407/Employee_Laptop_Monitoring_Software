import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
  updateUserStatus,
} from "./user.service.js";

export const create = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    profilePhoto: req.file?.buffer, // 🔥 FIX
  };

  const user = await createUser(payload);

  return sendSuccess(res, {
    statusCode: 201,
    message: "User created successfully",
    data: user,
  });
});

export const list = asyncHandler(async (req, res) => {
  const result = await listUsers(req.query);

  return sendSuccess(res, {
    message: "Users fetched successfully",
    data: result,
  });
});

export const getById = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);

  return sendSuccess(res, {
    message: "User fetched successfully",
    data: user,
  });
});

export const update = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    profilePhoto: req.file?.buffer,
  };

  const user = await updateUser(req.params.id, payload);

  return sendSuccess(res, {
    message: "User updated successfully",
    data: user,
  });
});

export const activate = asyncHandler(async (req, res) => {
  const user = await updateUserStatus(req.params.id, true);
  return sendSuccess(res, {
    message: "User activated successfully",
    data: user,
  });
});

export const deactivate = asyncHandler(async (req, res) => {
  const user = await updateUserStatus(req.params.id, false);
  return sendSuccess(res, {
    message: "User deactivated successfully",
    data: user,
  });
});

export const remove = asyncHandler(async (req, res) => {
  const user = await deleteUser(req.params.id);

  return sendSuccess(res, {
    message: "User deleted successfully",
    data: user,
  });
});
import bcrypt from "bcryptjs";
import User from "./user.model.js";
import { deleteImage, uploadImage } from "../../config/cloudinary.services.js";


export const createUser = async (payload) => {
  const {
    employeeId,
    name,
    email,
    password,
    role,
    department,
    profilePhoto,
  } = payload;

  if (!employeeId || !name || !email || !password || !role) {
    const error = new Error(
      "employeeId, name, email, password and role are required"
    );
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let photo = { url: null, publicId: null };

  if (profilePhoto) {
    photo = await uploadImage(profilePhoto, "profilePhoto");
  }


  const user = await User.create({
    employeeId,
    name,
    email,
    password: hashedPassword,
    role,
    department: department || null,
    profilePhoto: photo || null,
  });

  return await User.findById(user?._id)
    .select("-password")
    .populate("department", "name code");
};
export const deleteUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.profilePhoto?.publicId) {
    await deleteImage(user.profilePhoto.publicId);
  }
  await user.deleteOne();

  return user;
};

export const listUsers = async (query) => {
  const { role, department, isActive, page = 1, limit = 10 } = query;

  const filter = {};
  if (role) filter.role = role;
  if (department) filter.department = department;
  if (typeof isActive !== "undefined") filter.isActive = isActive === "true";

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .populate("department", "name code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-password").populate("department", "name code");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};


export const updateUser = async (id, payload) => {
  const user = await User.findById(id);

  if (!user) throw new Error("User not found");
  { console.log(payload) }
  if (payload?.profilePhoto) {
    // delete old image
    if (user.profilePhoto?.publicId) {
      await deleteImage(user.profilePhoto.publicId);
    }

    // upload new image
    const uploaded = await uploadImage(
      payload.profilePhoto,
      "profile_photos"
    );

    payload.profilePhoto = uploaded;
  }
  const allowedFields = ["name", "role", "department", "profilePhoto"];
  const updateData = {};

  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      updateData[key] = payload[key];
    }
  }

  const updated = await User.findByIdAndUpdate(id, updateData, {
    returnDocument: "after", // 🔥 FIX
    runValidators: true,
  })
    .select("-password")
    .populate("department", "name code");

  return updated;
};

export const updateUserStatus = async (id, isActive) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isActive },
    { returnDocument: "after", runValidators: true } // ✅ correct
  ).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};
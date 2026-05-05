import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../modules/users/user.model.js";

dotenv.config();

/* =========================
   DB CONNECT
========================= */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  }
};

/* =========================
   HASH PASSWORD
========================= */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/* =========================
   SEED USERS
========================= */
const seedUsers = async () => {
  try {
    console.log("🌱 Seeding users...");

    const users = [
      {
        employeeId: "EMP001",
        name: "Admin User",
        email: "admin@gmail.com",
        password: "123456",
        role: "ADMIN",
      },
      {
        employeeId: "EMP002",
        name: "Employee User",
        email: "hs285065@gmail.com",
        password: "123456",
        role: "EMPLOYEE",
      },
    ];

    for (let userData of users) {
      const existing = await User.findOne({ email: userData.email });

      if (existing) {
        console.log(`⚠️ User already exists: ${userData.email}`);
        continue;
      }

      const hashedPassword = await hashPassword(userData.password);

      await User.create({
        ...userData,
        password: hashedPassword,
      });

      console.log(`✅ User created: ${userData.email}`);
    }

    console.log("🎉 Seeding completed");
    process.exit();

  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

/* =========================
   RUN
========================= */
const run = async () => {
  await connectDB();
  await seedUsers();
};

run();
import User from "../users/user.model.js";
import bcrypt from "bcryptjs";
import Session from "../session/session.model.js";
import { deleteImage, uploadImage } from "../../config/cloudinary.services.js";

// ✅ FINAL DASHBOARD (ALL BUG FIXED)
export const dashboard = async (req, res) => {
  try {
    const range = req.query.range || "7d";
    let days =
      range === "today" ? 1 :
      range === "30d" ? 30 :
      range === "all" ? 365 : 7;

    const now = new Date();

    // Start of today
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const fromDate = new Date(todayStart);
    fromDate.setDate(fromDate.getDate() - (days - 1));

    // 🔥 FIXED QUERY (MAIN BUG FIX)
    const sessions = await Session.find({
      employeeId: req.user.id,
      $or: [
        { startTime: { $gte: fromDate } },
        { endTime: { $gte: fromDate } },
        { status: "ACTIVE" }
      ]
    }).sort({ startTime: 1 });

    let totalSeconds = 0;
    let activeSeconds = 0;
    let todayTotal = 0;
    let todayActive = 0;

    // ===============================
    // 🔥 MAIN LOOP
    // ===============================
    sessions.forEach((s) => {
      const st = new Date(s.startTime).getTime();

      let et;
      if (s.status === "ACTIVE") {
        et = now.getTime();
      } else {
        et = s.endTime
          ? new Date(s.endTime).getTime()
          : st;
      }

      const total = Math.max(
        0,
        Math.floor((et - st) / 1000)
      );

      const active =
        s.activeSeconds && s.activeSeconds > 0
          ? s.activeSeconds
          : total;

      totalSeconds += total;
      activeSeconds += active;

      if (new Date(s.startTime) >= todayStart) {
        todayTotal += total;
        todayActive += active;
      }
    });

    // ===============================
    // 🔥 CHART DATA (FIXED)
    // ===============================
    const chartData = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - i);

      const dStart = new Date(d).getTime();
      const dEnd = new Date(d);
      dEnd.setHours(23, 59, 59, 999);
      const dEndMs = dEnd.getTime();

      let daySec = 0;

      sessions.forEach((s) => {
        const st = new Date(s.startTime).getTime();
        const et = s.endTime
          ? new Date(s.endTime).getTime()
          : now.getTime();

        if (
          (st >= dStart && st <= dEndMs) ||
          (et >= dStart && et <= dEndMs)
        ) {
          daySec += Math.max(
            0,
            Math.floor((et - st) / 1000)
          );
        }
      });

      chartData.push({
        day: d.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        hours: Number((daySec / 3600).toFixed(2)),
      });
    }

    // ===============================
    // 🔥 RESPONSE
    // ===============================
    res.json({
      todayWorkHours: Number(
        (todayTotal / 3600).toFixed(2)
      ),
      activeTime: Number(
        (todayActive / 3600).toFixed(2)
      ),
      idleTime: Number(
        ((todayTotal - todayActive) / 3600).toFixed(2)
      ),
      totalWorkHours: Number(
        (totalSeconds / 3600).toFixed(2)
      ),
      productivity:
        totalSeconds === 0
          ? 0
          : Math.round(
              (activeSeconds / totalSeconds) * 100
            ),
      totalDaysWorked: new Set(
        sessions.map((s) =>
          new Date(s.startTime).toDateString()
        )
      ).size,
      totalSessions: sessions.length,
      chartData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET PROFILE (FULLY POPULATED)
export const getProfile = async (req, res) => {
  try {
    // 🔥 FIX: Sirf findById nahi, .populate use karna zaroori hai
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("department", "name code"); // Department ka name aur code uthayega

    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ UPDATE PROFILE (WITH IMAGE SUPPORT)
// employee.controller.js

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Text fields jo update karne hain
    const updateData = {
      name: req.body.name || user.name,
      email: req.body.email || user.email
    };

    // 🔥 IMAGE UPLOAD LOGIC
    if (req.file) {
      // 1. Purani image delete karo Cloudinary se agar publicId hai
      if (user.profilePhoto?.publicId) {
        await deleteImage(user.profilePhoto.publicId);
      }

      // 2. Nayi image upload karo - Buffer bhej rahe hain
      const uploaded = await uploadImage(req.file.buffer, "profile_photos");

      if (uploaded && uploaded.url) {
        updateData.profilePhoto = {
          url: uploaded.url,
          publicId: uploaded.publicId,
        };
      }
    }

    // 3. Database update
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    ).populate("department", "name code");

    res.json(updatedUser);
  } catch (err) {
    console.error("❌ Update Profile Error:", err);
    res.status(500).json({ message: "Node Sync Failed: " + err.message });
  }
};

// ✅ CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword?.trim() || !newPassword?.trim()) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ TIMER
export const getTimer = async (req, res) => {
  try {
    const session = await Session.findOne({
      employeeId: req.user.id,
      status: "ACTIVE",
    });

    if (!session) {
      return res.json({ active: false, seconds: 0 });
    }

    const diff = Math.floor(
      (Date.now() - new Date(session.startTime).getTime()) / 1000
    );

    res.json({ active: true, seconds: diff });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
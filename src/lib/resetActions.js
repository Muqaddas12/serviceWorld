"use server";

import jwt from "jsonwebtoken";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { SendMailHelper } from "./userActions";
// 1️⃣ Verify token from reset link
export async function verifyTokenAction(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, userId: decoded.userId };
  } catch {
    return { valid: false };
  }
}

// 2️⃣ Update password
export async function updatePasswordAction(token, newPassword) {
  try {
    console.log("▶ updatePasswordAction called");
    console.log("Token received:", token);
    console.log("New password length:", newPassword?.length);

    // 1️⃣ JWT verify
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token decoded:", decoded);
    } catch (jwtErr) {
      console.error("❌ JWT verification failed:", jwtErr.message);
      throw jwtErr;
    }

    // 2️⃣ DB connection
    const client = await clientPromise;
    const db = client.db("smmpanel");
    console.log("✅ DB connected");

    // 3️⃣ Fetch user
    console.log("Finding user with ID:", decoded.userId);
    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.userId),
    });

    if (!user) {
      console.error("❌ User not found for ID:", decoded.userId);
      return { success: false, message: "User not found" };
    }

    console.log("✅ User found:", {
      id: user._id.toString(),
      email: user.email,
    });

    // 4️⃣ Hash password
    const hashed = await bcrypt.hash(newPassword, 10);
    console.log("✅ Password hashed");

    // 5️⃣ Update password
    const updateResult = await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { password: hashed },
        $unset: { resetToken: "", resetTokenExpiry: "" },
      }
    );

    console.log("✅ Update result:", updateResult);

    // 6️⃣ Send email
    console.log("Sending confirmation email to:", user.email);

    await SendMailHelper(
      user.email,
      "Your password has been updated",
      `
        <p>Hello ${user.username},</p>
        <p>Your password was successfully updated.</p>
        <p>If you did not perform this action, please contact support immediately.</p>
        <p>— Support Team</p>
      `
    );

    console.log("✅ Email sent");

    return { success: true, message: "Password updated successfully!" };
  } catch (err) {
    console.error("❌ updatePasswordAction failed:", err);
    return { success: false, message: "Invalid or expired link" };
  }
}


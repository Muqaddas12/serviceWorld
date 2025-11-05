'use server'
import clientPromise from "@/lib/mongodb";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;
// ========================= GET USER DETAILS =========================
export async function getUserDetails() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return { error: "Not authenticated" };

    const decoded = jwt.verify(token.value, JWT_SECRET);

    const client = await clientPromise;
    const db = client.db("smmpanel");

    const user = await db
      .collection("users")
      .findOne({ email: decoded.email }, { projection: { password: 0 } });

    if (!user) return { error: "User not found" };
    return {
  success:true,
    avatar:user.avatar,
    balance:user.balance,
    email:user.email,
    username:user.username,
    frozen:user.frozen,
}
  } catch (err) {
    return { error: err.message };
  }
}
export async function getUserBalance() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return { error: "Not authenticated" };

    const decoded = jwt.verify(token.value, JWT_SECRET);

    const client = await clientPromise;
    const db = client.db("smmpanel");

    const user = await db
      .collection("users")
      .findOne({ email: decoded.email }, { projection: { password: 0 } });

    if (!user) return { error: "User not found" };
const balance=user?.balance
    return {  balance};
  } catch (err) {
    return { error: err.message };
  }
}


// -------------------- Upload Profile Picture --------------------
export async function uploadProfilePicture(formData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Not authenticated" };
    }

    // Verify token
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return { error: "Invalid token" };
    }

    // Get file from formData
    const file = formData.get("image");
    if (!file) {
      return { error: "No file uploaded" };
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save file to public/uploads
    const uploadDir = path.join(process.cwd(), "/public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Save avatar URL in MongoDB
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const imageUrl = "/uploads/" + fileName;

    await db.collection("users").updateOne(
      { email: payload.email },
      { $set: { avatar: imageUrl } }
    );

    return { success: true, message: "Image uploaded", avatar: imageUrl };
  } catch (err) {
    return { error: err.message };
  }
}

// -------------------- Get Profile Picture / Details --------------------
export async function getProfilePicture() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Not authenticated" };
    }

    // Verify token
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return { error: "Invalid token" };
    }

    // Fetch user data
    const client = await clientPromise;
    const db = client.db("smmpanel");

    const user = await db.collection("users").findOne(
      { email: payload.email },
      { projection: { username: 1, email: 1, balance: 1, avatar: 1 } }
    );

    if (!user) return { error: "User not found" };

    return { success: true, avatar:user.avatar };
  } catch (err) {
    return { error: err.message };
  }
}






export async function generateApiKey() {
  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const users = db.collection("users");
   const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return { error: "Not authenticated" };

    const decoded = jwt.verify(token.value, JWT_SECRET);

    // Generate a secure API key
    const apiKey = "sk-" + crypto.randomBytes(24).toString("hex");

    // Update user record using email
    const result = await users.updateOne(
      { email: decoded.email },
      { $set: { apiKey, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found with that email." };
    }

    return { success: true, apiKey };
  } catch (err) {
    console.error("❌ API key generation failed:", err);
    return { success: false, error: "Failed to generate API key." };
  }
}

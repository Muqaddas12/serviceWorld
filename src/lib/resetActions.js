"use server";

import jwt from "jsonwebtoken";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const client = await clientPromise;
    const db = client.db("smmpanel");

    const hashed = await bcrypt.hash(newPassword, 10);
const dbuser=await db.collection('users').findOne({_id:new ObjectId(decoded.userId)})

    await db.collection("users").updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { password: hashed } }
    );
const mailSubject = "New Ticket Received";


const userEmail = dbuser?.email; 

const mailMessage = `
<p>Hello ${dbuser.username},</p>

<p>Your support ticket has received a new reply.</p>



<p><strong>Reply:</strong></p>
<div style="background:#f4f4f4;padding:12px;border-radius:6px;">
  
</div>

<p>Please log in to your account to view and respond to this ticket.</p>

<p>— Support Team</p>
`;


await SendMailHelper(userEmail, mailSubject, mailMessage);

    return { success: true, message: "Password updated successfully!" };
  } catch {
    return { success: false, message: "Invalid or expired link" };
  }
}

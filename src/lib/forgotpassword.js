"use server";

import clientPromise from "./mongodb";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
const DB_ADMIN = "smmadmin";
export async function forgotPasswordAction(email) {

    
    try {
      const client = await clientPromise;
      const db = client.db("smmpanel");

      // 1️⃣ Check if user exists
      const user = await db.collection("users").findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") }
  });

      if (!user) {
        return { success: false, message: "Email not found" };
      }
  const admindb= client.db(DB_ADMIN)
      // 2️⃣ Get SMTP config from DB
      const smtp = await admindb.collection("smtp_config").findOne({});
    
      if (!smtp) {
        return { success: false, message: "SMTP not configured" };
      }

      // 3️⃣ Generate Reset Token (valid for 30 mins)
      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );

      const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/forgotpassword?token=${token}`;


      // 4️⃣ Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: Number(smtp.port),
        secure: true,
        auth: {
          user: smtp.user,
          pass: smtp.pass,
        },
      });

      // 5️⃣ Send Email
      await transporter.sendMail({
        from: `"${smtp.fromName}" <${smtp.fromEmail}>`,
        to: email,
        subject: "Password Reset Request",
        html: `
          <p>Hello ${user.name || ""},</p>
          <p>Click below to reset your password:</p>
          <a href="${resetLink}" style="color:blue">${resetLink}</a>
          <p>This link will expire in 30 minutes.</p>
        `,
      });

      return { success: true, message: "Reset email sent" };

    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
}

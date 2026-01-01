"use server";
import { headers } from "next/headers";
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


    // ⭐ 4️⃣ Auto-detect BASE URL dynamically
    const headerList = await headers();
    const host = headerList.get("host");          // example.com
    const protocol = headerList.get("x-forwarded-proto") || "https"; 
    const baseUrl = `${protocol}://${host}`;

    const resetLink = `${baseUrl}/reset-password?token=${token}`;


        // 4️⃣ Create Nodemailer transporter
        const transporter = nodemailer.createTransport({
          host: smtp.host,
          port: Number(smtp.port),
          secure: false,
          auth: {
            user: smtp.user,
            pass: smtp.pass,
          },
        });

        // 5️⃣ Send Email
   const data=  await transporter.sendMail({
  from: `"${smtp.user}" <${smtp.user}>`,
  to: email,
  subject: "Password Reset Request",
  html: `
    <p>Hello ${user.name || ""},</p>
    <p>Click below to reset your password:</p>
    <a href="${resetLink}" style="color:blue">${resetLink}</a>
    <p>This link will expire in 30 minutes.</p>
  `,
});
console.log(data)
      return { success: true, message: "Reset email sent" };

    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
}

// pages/api/admin/send-email.js
import nodemailer from "nodemailer";
import clientPromise from "@/lib/mongodb"; // adjust path to your clientPromise
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  JWT_SECRET,
  DB_ADMIN, // optional if using another DB for users
} = process.env;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    // verify admin from cookie token
    const token = (req.cookies && req.cookies.token) || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // optional check for admin role - adjust field as needed
    if (!decoded || (decoded.role && decoded.role !== "admin")) {
      // allow further check by fetching user from DB if needed
      // fallback: continue only if decoded.isAdmin true
      if (!decoded.isAdmin) {
        return res.status(403).json({ message: "Forbidden - admin only" });
      }
    }

    const { mode, userIds = [], email, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required." });
    }

    const client = await clientPromise;
    const db = client.db("smmpanel");
    const usersCollection = db.collection("users");

    let recipients = [];

    if (mode === "all") {
      // fetch all active users' emails
      const cursor = usersCollection.find({ email: { $exists: true, $ne: "" } }, { projection: { email: 1 } });
      const all = await cursor.toArray();
      recipients = all.map((u) => u.email).filter(Boolean);
    } else if (mode === "selected") {
      // userIds may be ids or emails; allow both
      const ids = userIds.filter(Boolean);
      const objectIds = ids.filter((i) => /^[0-9a-fA-F]{24}$/.test(i)).map((i) => new ObjectId(i));
      const emails = ids.filter((i) => !/^[0-9a-fA-F]{24}$/.test(i));

      const dbQuery = [];
      if (objectIds.length) dbQuery.push({ _id: { $in: objectIds } });
      if (emails.length) dbQuery.push({ email: { $in: emails } });

      if (dbQuery.length === 0) {
        return res.status(400).json({ message: "No valid selected users provided." });
      }

      const docs = await usersCollection.find({ $or: dbQuery }, { projection: { email: 1 } }).toArray();
      recipients = docs.map((d) => d.email).filter(Boolean);
    } else if (mode === "single") {
      if (!email) return res.status(400).json({ message: "Recipient email is required." });
      recipients = [String(email).trim()];
    } else {
      return res.status(400).json({ message: "Invalid mode." });
    }

    // dedupe recipients and remove empties
    recipients = Array.from(new Set((recipients || []).map((r) => String(r).trim()).filter(Boolean)));

    if (!recipients.length) return res.status(400).json({ message: "No recipient emails found." });

    // create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465, // true for 465
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // send emails in batches to avoid extremely large single recipients array
    // We'll send a single mail per recipient (could be optimized to BCC, but that reveals recipients)
    const results = [];
    for (const r of recipients) {
      try {
        const info = await transporter.sendMail({
          from: SMTP_FROM || SMTP_USER,
          to: r,
          subject,
          html: message, // allow HTML
          text: message.replace(/<\/?[^>]+(>|$)/g, ""), // fallback plain text
        });
        results.push({ to: r, success: true, info });
      } catch (err) {
        console.error("Email send error:", err, r);
        results.push({ to: r, success: false, error: err.message });
      }
    }

    const sent = results.filter((r) => r.success).length;
    const failed = results.length - sent;

    // Optionally record a log in DB
    await db.collection("admin_email_logs").insertOne({
      adminId: decoded.id || decoded.userId || null,
      subject,
      message,
      mode,
      recipientsCount: recipients.length,
      sent,
      failed,
      createdAt: new Date(),
      details: results.slice(0, 20), // keep small preview
    });

    return res.status(200).json({
      message: `Emails processed. Sent: ${sent}, Failed: ${failed}`,
      resultsCount: results.length,
      sent,
      failed,
    });
  } catch (err) {
    console.error("send-email API error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

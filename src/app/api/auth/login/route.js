import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyCaptcha } from "@/lib/recaptha";
import { cookies } from "next/headers";

const rateLimitMap = new Map();
const WINDOW_TIME = 15 * 60 * 1000; // 15 min
const MAX_REQUESTS = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return false;
  }
  const data = rateLimitMap.get(ip);
  if (now - data.startTime > WINDOW_TIME) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return false;
  }
  if (data.count >= MAX_REQUESTS) return true;
  data.count += 1;
  rateLimitMap.set(ip, data);
  return false;
}

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  if (checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests, try again later." }), { status: 429 });
  }

  const { email, password, captcha } = await req.json();

  if (!email || !password || !captcha) {
    return new Response(JSON.stringify({ error: "Missing fields or CAPTCHA" }), { status: 400 });
  }

  const isHuman = await verifyCaptcha(captcha);
  if (!isHuman) return new Response(JSON.stringify({ error: "CAPTCHA verification failed" }), { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");

    const user = await db.collection("users").findOne({ email });
    if (!user) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });

    // Generate JWT
    const token = jwt.sign({ username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    

    const response = new Response(JSON.stringify({ message: "Login successful" }), { status: 200 });
    await cookies().set("token", token, { req, res: response, httpOnly: true, maxAge: 7 * 24 * 60 * 60 });
    return response;
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

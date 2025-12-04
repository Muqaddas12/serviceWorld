import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export async function GET(req) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return Response.json({ error: "Missing code" }, { status: 400 });
  }

  const host = req.headers.get("host");
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

  const client = await clientPromise;
  const db = client.db("smmadmin");

  const config = await db.collection("OAuthConfig").findOne({ provider: "google" });

  if (!config) {
    return Response.json({ error: "OAuth not configured" }, { status: 400 });
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  }).then((res) => res.json());

  const googleUser = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenRes.access_token}` },
  }).then((res) => res.json());

  const randomPassword = Math.random().toString(36).slice(2, 10);
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  const userData = {
    email: googleUser.email.toLowerCase(),
    name: googleUser.name,
    username: googleUser.email.split("@")[0],
    image: googleUser.picture,
    password: hashedPassword,
    oauthProvider: "google",
    updatedAt: new Date(),
  };

  // 🔥 FIX: Make sure updated user always returned
  const result = await db.collection("users").findOneAndUpdate(
    { email: googleUser.email.toLowerCase() },
    { $set: userData },
    {
      upsert: true,
      returnDocument: "after",
    }
  );

  const user =
    result.value ||
    (await db.collection("users").findOne({ email: googleUser.email.toLowerCase() }));

  if (!user) {
    return Response.json({ error: "User save failed" }, { status: 500 });
  }

  const tokenPayload = {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    frozen: user.frozen || false,
    role: user.role || "user",
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });


return Response.redirect(`${protocol}://${host}/auth/google-success`);

}

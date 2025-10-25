import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to protect admin routes
 * Returns payload if token is valid, otherwise throws an error
 */
export async function verifyAdmin(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("adminToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload; // contains { id, email }
  } catch (err) {
    throw new Error("Invalid token");
  }
}

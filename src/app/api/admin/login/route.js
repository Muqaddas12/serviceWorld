import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const admin = await getAdminByEmail(email);

    if (!admin || admin.password !== password) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401 }
      );
    }

  
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

 
    cookies().set({
      name: "adminToken",
      value: token,
      httpOnly: true,
      path: "/admin",        
      maxAge: 60 * 60,  // 1 hour
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}

"use server";

import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyCaptcha } from "@/lib/recaptha";

// =========================
// RATE LIMIT CONFIGURATION
// =========================
const rateLimitMap = new Map();
const WINDOW_TIME = 15 * 60 * 1000; // 15 minutes
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

// =========================
// USER SIGNUP
// =========================
export async function registerUser({ email, username, password,mobile, captcha, ip = "127.0.0.1" }) {
  console.log(email,username,password,captcha,ip)
  try {
    if (checkRateLimit(ip)) {
      return { error: "Too many requests, try again later." };
    }

    if (!email || !username || !password || !captcha || !mobile) {
      return { error: "Missing fields or CAPTCHA" };
    }

    const isHuman = await verifyCaptcha(captcha);
    if (!isHuman) return { error: "CAPTCHA verification failed" };

    const client = await clientPromise;
    const db = client.db("smmpanel");

    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) return { error: "User or email already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, email,mobile, password: hashedPassword };
    await db.collection("users").insertOne(user);

    // Generate JWT
    const token = jwt.sign({ username, email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    });

    return { message: "User registered successfully" };
  } catch (err) {
    return { error: err.message };
  }
}

// =========================
// USER LOGIN
// =========================


export async function loginUser({ email, password, captcha, ip = "127.0.0.1" }) {
  try {
    // 🧠 1. Rate limiting
    if (checkRateLimit(ip)) {
      return { error: "Too many requests, please try again later." };
    }

    // 🧩 2. Field validation
    if (!email || !password || !captcha) {
      return { error: "Missing fields or CAPTCHA." };
    }

    // 🤖 3. Verify CAPTCHA
    const isHuman = await verifyCaptcha(captcha);
    if (!isHuman) return { error: "CAPTCHA verification failed." };

    // ⚙️ 4. Connect to database
    const client = await clientPromise;
    const db = client.db("smmpanel");

    // 🔍 5. Find user
    const user = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (!user) return { error: "Invalid credentials." };

    // 🧊 6. Check if frozen
    if (user.frozen === true) {
      return { error: "Your account is frozen. Please contact support." };
    }

    // 🔑 7. Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return { error: "Invalid credentials." };

    // 🔒 8. Create JWT token
   const tokenPayload = {
  id: user._id.toString(),
  username: user.username,
  email: user.email,
  frozen: user?.frozen || false,
  role: user?.role || "user",
};
console.log(tokenPayload)

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 🍪 9. Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ important for HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // 🎯 10. Return sanitized user info
    return {
      success: true,
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        frozen: user.frozen || false,
      },
    };
  } catch (err) {
    console.error("❌ Login Error:", err);
    return { error: "Server error: " + err.message };
  }
}

// =========================
// LOGOUT USER
// =========================
export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { message: "Logged out successfully" };
  } catch (err) {
    return { error: err.message };
  }
}


// =========================
// CHECK USERNAME
// =========================
export async function checkUsername(username) {
  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const user = await db.collection("users").findOne({ username });
   if(user.username){
    return {
      status:true
    }
   }else{
    return{
      status:false
    }
   }
  } catch (err) {
    return {
      status:false,
       error: err.message 
      };
  }
}

// =========================
// CHECK EMAIL
// =========================
export async function checkEmail(email) {
  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const user = await db.collection("users").findOne({ email });
    if(user.email)
      return { status: true }
    else{
      return {
        status:false
      }
     }
  } catch (err) {
    return { 
      status:false,
      error: err.message };
  }
}


export async function changePassword({ currentPassword, newPassword, ip = "127.0.0.1" }) {
  try {
    if (checkRateLimit(ip)) {
      return { error: "Too many requests, try again later." };
    }

    if (!currentPassword || !newPassword) {
      return { error: "Missing required fields" };
    }

    // ✅ Get user info from JWT cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { error: "Unauthorized: No token found" };

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return { error: "Invalid or expired session. Please log in again." };
    }

    const { email } = decoded;
    if (!email) return { error: "Invalid token data" };

    // ✅ Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("smmpanel");

    // ✅ Find user
    const user = await db.collection("users").findOne({ email });
    if (!user) return { error: "User not found" };

    // ✅ Check current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return { error: "Current password is incorrect" };

    // ✅ Hash and update new password
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.collection("users").updateOne({ email }, { $set: { password: hashed } });

    // ✅ Optionally refresh JWT (not mandatory)
    const newToken = jwt.sign(
      { username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    cookieStore.set("token", newToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    });

    return { message: "Password updated successfully" };
  } catch (err) {
    return { error: err.message };
  }
}






























//**************************************************************************** */
//*********************************Admin Route*************************** */
//************************************************************************88 */




export async function adminLoginAction(email,password) {

  // Dummy check
  if (email === "test@gmail.com" && password === "hello") {
    // Create token
    const token = jwt.sign({ email,role:'admin' }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set cookie
  const cookieStore= await cookies()
  cookieStore.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return { success: true, message: "Login successful" };
  } else {
    return { success: false, message: "Invalid credentials" };
  }
}




// =========================
// LOGOUT USER
// =========================
export async function LogoutAdmin() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    return { message: "Logged out successfully" };
  } catch (err) {
    return { error: err.message };
  }
}

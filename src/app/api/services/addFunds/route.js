// api/services/addFunds/route.js
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ValidateTransactionBharatPe } from "@/lib/adminServices";

// ✅ MongoDB connection (reusable)
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "smmpanel";
const addFundsCollection = "add_funds";
const usersCollection = "users";

let cachedClient = null;
async function getClient() {
  if (cachedClient) return cachedClient;
  await client.connect();
  cachedClient = client;
  return cachedClient;
}

export async function POST(request) {
  try {
    // 1️⃣ JWT verification
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Verification failed");

    let userEmail;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch {
      throw new Error("Verification failed");
    }

    // 2️⃣ Parse request body
    const { utr, payment_amount, payment_type } = await request.json();
    if (!utr || !payment_amount) throw new Error("Invalid request data");

    // 3️⃣ Connect to DB
    const client = await getClient();
    const db = client.db(dbName);
    const addFundsCol = db.collection(addFundsCollection);
    const usersCol = db.collection(usersCollection);

    // 4️⃣ Check if UTR already used
    const existing = await addFundsCol.findOne({ utr });
    if (existing) throw new Error("UTR already used");

    // 5️⃣ Validate transaction from BharatPe
    const matchedTx = await ValidateTransactionBharatPe(utr, payment_amount);
    if (!matchedTx) throw new Error("No transactions found");

    // 6️⃣ Insert verified transaction
    const newTx = {
      utr,
      payment_amount: Number(payment_amount),
      payment_type,
      status: "verified",
      createdAt: new Date(),
      bharatPeId: matchedTx?.id || null,
      userEmail,
    };
    await addFundsCol.insertOne(newTx);

    // 7️⃣ Update user balance
    await usersCol.updateOne(
      { email: userEmail },
      { $inc: { balance: Number(payment_amount) } }
    );

    return NextResponse.json({ success: true, transaction: newTx });
  } catch (err) {
    console.error("Add Funds Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Verification failed" },
      { status: 400 }
    );
  }
}

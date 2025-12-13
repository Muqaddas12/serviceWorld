'use server'
import clientPromise from "@/lib/mongodb";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { createOrder } from "./services";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { ValidateTransactionBharatPe } from "./adminServices";
const dbName = "smmpanel";
const addFundsCollection = "add_funds";
const JWT_SECRET = process.env.JWT_SECRET;
const DB_ADMIN = "smmadmin";


export async function getPaymentHistory() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const paymentCollection = db.collection(addFundsCollection);

    const result = await paymentCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const filteredResult = result.map((t) => ({
      ...t,
      _id: t._id.toString(),
      
    }));

    return filteredResult;
  } catch (error) {
    console.error(error);
    return [];
  }
}



// ========================= GET USER DETAILS =========================
export async function getUserDetails() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return {
        success: false,
        user: null,
        balance: 0,   // ALWAYS RETURN DEFAULT
        error: "Not authenticated",
      };
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);

    const client = await clientPromise;
    const db = client.db("smmpanel");

    const user = await db
      .collection("users")
      .findOne({ email: decoded.email }, { projection: { password: 0 } });

    if (!user) {
      return {
        success: false,
        user: null,
        balance: 0,
        error: "User not found",
      };
    }

    return {
      success: true,
      avatar: user.avatar,
      balance: user.balance ?? 0,
      email: user.email,
      username: user.username,
      frozen: user.frozen,
      mobileNumber:user.mobileNumber
    };
  } catch (err) {
    return {
      success: false,
      user: null,
      balance: 0,
      error: err.message,
    };
  }
}



export async function updateMobileNumber(mobileNumber) {
  try {
    // Validate input
    if (!mobileNumber || mobileNumber.length < 10) {
      return {
        success: false,
        error: "Invalid mobile number",
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    // Decode token
    const decoded = jwt.verify(token.value, JWT_SECRET);

    // Database connection
    const client = await clientPromise;
    const db = client.db("smmpanel");

    // Update user
    const result = await db.collection("users").findOneAndUpdate(
      { email: decoded.email },
      { $set: { mobileNumber } }, // Only update mobile number
      {
        returnDocument: "after", // return updated user
        projection: { password: 0 },
      }
    );

    if (!result) {
      return {
        success: false,
        error: "User not found",
      };
    }
console.log(result)
    return {
      success: true,
      message: "Mobile number updated successfully",
     
    };
  } catch (err) {
    console.error("Update mobile error:", err);
    return {
      success: false,
      error: err.message,
    };
  }
}


export async function getUserBalance() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return { success:false, balance: 0, error: "Not authenticated" };
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);

    const client = await clientPromise;
    const db = client.db("smmpanel");

    const user = await db
      .collection("users")
      .findOne({ email: decoded.email }, { projection: { password: 0 } });

    if (!user) return { success:false, balance: 0, error: "User not found" };

    return { success:true, balance: user.balance ?? 0 };
  } catch (err) {
    return { success:false, balance: 0, error: err.message };
  }
}


// ========================= Generate Api Key =========================
export async function generateApiKey() {
  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const users = db.collection("users");
    const apiKeys = db.collection("apikey");
   const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return { error: "Not authenticated" };

    const decoded = jwt.verify(token.value, JWT_SECRET);

    // Generate a secure API key
    const apiKey = "sk-" + crypto.randomBytes(12).toString("hex");

    // Update user record using email
    const result = await users.updateOne(
      { email: decoded.email },
      { $set: { apiKey, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found with that email." };
    }
  await apiKeys.insertOne({
      email: decoded.email,
      apiKey,
      createdAt: new Date(),
    });

    return { success: true, apiKey };
  } catch (err) {
    console.error("❌ API key generation failed:", err);
    return { success: false, error: "Failed to generate API key." };
  }
}
function generateFallbackOrderId() {
  return Math.floor(1000 + Math.random() * 9000); // 1000–9999
}

// ========================= Create Order Action =========================
export async function createOrderAction(service, link, qua, paying) {
  try {
    console.log("🔵 Starting Create Order Action...");

    // 1️⃣ Get user token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized — please log in first." };
    }

    // 2️⃣ Verify token
    let userData;
    try {
      userData = jwt.verify(token, JWT_SECRET);
    } catch {
      return { success: false, message: "Invalid or expired token." };
    }

    // 3️⃣ DB
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const usersCollection = db.collection("users");

    // 4️⃣ Find user
    const user = await usersCollection.findOne({ _id: new ObjectId(userData.id) });
    if (!user) return { success: false, message: "User not found." };

    // -------------------- Providers & Service --------------------
    const providers = await client
      .db(DB_ADMIN)
      .collection("Providers")
      .find({})
      .toArray();
console.log(service)
    // fetch service once and reuse
    const dbservice = await client
      .db(DB_ADMIN)
      .collection("services")
      .findOne({ service: (service) });
console.log(service,dbservice)
    // find provider matching the service provider URL
    const result = providers.find((p) => p.providerUrl === dbservice?.provider);
console.log('this is result',result,result.providerUrl===dbservice.provider)
    // 5️⃣ Inputs
    const quantity = Number(qua);
    const charge = Number(paying);

    if (!service || !link || !Number.isFinite(quantity) || quantity <= 0)
      return { success: false, message: "Invalid input." };

    if (!Number.isFinite(charge) || charge <= 0)
      return { success: false, message: "Invalid charge amount." };

    // 6️⃣ Check balance
    const balance = Number(user.balance);
    if (!Number.isFinite(balance) || balance < charge) {
      return { success: false, message: "Insufficient balance." };
    }

    // 7️⃣ Provider order body
    const orderData = { service, link, quantity };

    // 8️⃣ Call provider
    let response;
    try {
      response = await createOrder(orderData);
    } catch (e) {
      response = null;
    }

    // ========================= PROVIDER FAILED =========================
    if (!response || response.error) {
      console.log("❌ Provider failed:", response?.error);

      const fallbackId = generateFallbackOrderId(); // 4-digit ID
      const updatedBalance = balance - charge;

      // Deduct user balance
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { balance: updatedBalance } }
      );

      // Use previously fetched dbservice for profit calculation
      const serviceData = dbservice;

      const profitPercentage = Number(serviceData?.profitPercentage) || 0;
      const profit = (charge * profitPercentage) / 100;

      // If provider result is undefined, guard accessing its fields
      const providerUrlForInsert = result?.providerUrl || null;
      const providerApiKeyForInsert = result?.apiKey || null;

      // Insert order with fallback ID
      await db.collection("orders").insertOne({
        userId: user._id.toString(),
        username: user.username,
        userEmail: user.email,

        ProviderUrl: providerUrlForInsert,
        providerApiKey: providerApiKeyForInsert,

        service,
        link,
        quantity,
        charge,
        profit,

        status: "Pending",
        providerOrderId: fallbackId,
        providerError: response?.error || "Provider unreachable",
        startCount: 0,
        remains: 0,
        createdAt: new Date(),
      });

      revalidatePath("/user/dashboard");

      return {
        success: true,
        message: "Order placed successfully!",
        orderId: fallbackId,
        balanceAfter: updatedBalance,
        warning: "Provider not available, order queued.",
      };
    }

    // ========================= PROVIDER SUCCESS =========================

    const updatedBalance = balance - charge;

    // Deduct balance
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { balance: updatedBalance } }
    );

    // Reuse dbservice (already fetched above) for profit
    const serviceData = dbservice;
    if (!serviceData)
      return { success: false, message: "Service not found ." };

    const profitPercentage = Number(serviceData.profitPercentage) || 0;
    const profit = (charge * profitPercentage) / 100;

    // Use the matched provider info found earlier (result)
    const providerUrlForOrder = result?.providerUrl || null;
    const providerApiKeyForOrder = result?.apiKey || null;

    const newOrder = {
      userId: user._id.toString(),
      username: user.username,
      userEmail: user.email,

      ProviderUrl: providerUrlForOrder,
      providerApiKey: providerApiKeyForOrder,

      service,
      link,
      quantity,
      charge,
      profit,

      status: "Pending",
      startCount: 0,
      remains: 0,
      providerOrderId: response.order,
      createdAt: new Date(),
    };

    // Insert order
    await db.collection("orders").insertOne(newOrder);

    revalidatePath("/user/dashboard");

    return {
      success: true,
      message: "Order created successfully!",
      orderId: response.order,
      balanceAfter: updatedBalance,
      profit,
    };

  } catch (err) {
    console.error("❌ ERROR in createOrderAction:", err);
    return { success: false, message: "Internal server error." };
  }
}






export async function getUserOrders() {
  try {
    // 1. Token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { error: "Unauthorized. Please login." };

    // 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return { error: "Invalid or expired token." };
    }

    const userIdString = decoded.id;
    const email = decoded.email;
    const username = decoded.username;

    // 3. DB
    const client = await clientPromise;
    const db = client.db("smmpanel");

    // 4. Fetch user's orders
    const orders = await db.collection("orders")
      .find({
        $or: [
          { userId: userIdString },
          { userEmail: email },
          { username: username },
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

    // 5. Iterate each order and update provider data (if needed)
    const finalOrders = await Promise.all(
      orders.map(async (order) => {
        let providerStatus = null;

        // ⏳ cooldown logic (1 hour = 3600000 ms)
        const oneHour = 60 * 60 * 1000;
        const now = Date.now();
        const lastFetched = order.fetchedAt
          ? new Date(order.fetchedAt).getTime()
          : 0;

        const shouldFetch = now - lastFetched > oneHour;

        if (
          shouldFetch &&
          order.providerOrderId &&
          order.providerApiKey &&
          order.ProviderUrl
        ) {
          // 🔥 Fetch fresh provider status
          try {
            const params = new URLSearchParams();
            params.append("key", order.providerApiKey);
            params.append("action", "status");
            params.append("order", order.providerOrderId);

            const res = await axios.post(order.ProviderUrl, params, {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            providerStatus = res.data;

            // 🔥 Update DB with new provider data + timestamp
            await db.collection("orders").updateOne(
              { _id: order._id },
              {
                $set: {
                  status: providerStatus.status ?? order.status,
                  startCount: Number(providerStatus.start_count ?? order.startCount ?? 0),
                  remains: Number(providerStatus.remains ?? order.remains ?? 0),
                  charge: Number(providerStatus.charge ?? order.charge ?? 0),
                  fetchedAt: new Date(),   // ⭐ added
                  updatedAt: new Date(),
                },
              }
            );
          } catch (err) {
            providerStatus = { error: "Provider API failed", details: err.message };
          }
        } else {
          // ❌ No provider fetch this time (cooldown)
          providerStatus = {
            note: "Skipped fetch — last fetched < 1 hour ago",
          };
        }

        // Get latest version from DB
        const fresh = await db.collection("orders").findOne({ _id: order._id });

        // Return JSON-safe object
        return {
          ...fresh,
          _id: fresh._id.toString(),
          userId: fresh.userId?.toString?.() ?? String(fresh.userId ?? ""),
          createdAt:
            fresh.createdAt instanceof Date
              ? fresh.createdAt.toISOString()
              : String(fresh.createdAt ?? ""),
          updatedAt:
            fresh.updatedAt instanceof Date
              ? fresh.updatedAt.toISOString()
              : String(fresh.updatedAt ?? ""),
          fetchedAt:
            fresh.fetchedAt instanceof Date
              ? fresh.fetchedAt.toISOString()
              : "",
          providerStatus,
        };
      })
    );

    // 6. Return updated orders
    return {
      success: true,
      count: finalOrders.length,
      orders: finalOrders,
    };

  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    return { error: "Server error: " + err.message };
  }
}











// ========================= GET USER Transactions =========================
export async function getUserTransactions() {
  try {
    // Read token
    const cookieStore = await cookies(); 
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    // Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // this is ObjectId string

    // DB
    const client = await clientPromise;
    const db = client.db(dbName);
    const addFundsCol = db.collection(addFundsCollection);

    // Fetch all user transactions
    const transactions = await addFundsCol
      .find({ userId: new ObjectId(userId) })   // FIXED
      .sort({ createdAt: -1 })
      .toArray();

    // Prepare safe JSON data
    const safeTransactions = transactions.map((t) => ({
      ...t,
      _id: t._id.toString(),
      userId: t.userId.toString(),
      createdAt: t.createdAt?.toISOString?.() || null,
    }));

    return { success: true, transactions: safeTransactions };
  } catch (err) {
    console.error("Get history error:", err);
    return { success: false, error: "Unauthorized" };
  }
}

// ========================= Upload Profile Picutre =========================
export async function uploadProfilePicture(formData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Not authenticated" };

    // Verify token
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return { error: "Invalid token" };
    }

    const file = formData.get("image");
    if (!file) return { error: "No file uploaded" };

    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();

    // Convert to base64
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Add MIME type prefix e.g. data:image/png;base64,...
    const mimeType = file.type;
    const imageData = `data:${mimeType};base64,${base64Image}`;

    // Save in DB
    const client = await clientPromise;
    const db = client.db("smmpanel");

    await db.collection("users").updateOne(
      { email: payload.email },
      { $set: { avatar: imageData } }
    );

    return { success: true, avatar: imageData };
  } catch (err) {
    return { error: err.message };
  }
}



export async function getProfilePicture() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Not authenticated" };

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return { error: "Invalid token" };
    }

    const client = await clientPromise;
    const db = client.db("smmpanel");

    const user = await db.collection("users").findOne(
      { email: payload.email },
      { projection: { avatar: 1 } }
    );

    if (!user) return { error: "User not found" };

    return { success: true, avatar: user.avatar };
  } catch (err) {
    return { error: err.message };
  }
}



export async function deleteProfilePicture() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Not authenticated" };

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return { error: "Invalid token" };
    }

    const client = await clientPromise;
    const db = client.db("smmpanel");

    await db.collection("users").updateOne(
      { email: payload.email },
      { $set: { avatar: null } }
    );

    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}



























export async function createRandomOrders() {
  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");

    const userId = new ObjectId("68fdbcc2cbc279f65b0116df"); // fixed user ID

    // 🔥 Realistic SMM services
    const services = [
      "Instagram Followers",
      "Instagram Likes",
      "Instagram Reels Views",
      "Instagram Story Views",
      "YouTube Views",
      "YouTube Subscribers",
      "YouTube Likes",
      "TikTok Followers",
      "TikTok Likes",
      "TikTok Views",
      "Facebook Page Likes",
      "Facebook Followers",
      "Twitter Followers",
      "Twitter Likes",
      "Telegram Group Members",
      "Telegram Post Views",
      "Spotify Plays",
      "LinkedIn Followers",
      "Website Traffic",
      "Threads Followers",
    ];

    // 🔥 Possible statuses
    const statuses = [
      "Pending",
      "Processing",
      "In Progress",
      "Completed",
      "Partial",
      "Canceled",
    ];

    // Function to generate random date from last 30 days
    const randomDate = () => {
      const daysAgo = Math.floor(Math.random() * 30); // 0–29 days
      const hoursAgo = Math.floor(Math.random() * 24);
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      d.setHours(d.getHours() - hoursAgo);
      return d;
    };

    const orders = [];

    for (let i = 0; i < 20; i++) {
      const newOrder = {
        userId,
        service: services[Math.floor(Math.random() * services.length)],
        link: `https://example.com/post/${Math.floor(Math.random() * 999999)}`,
        quantity: Math.floor(Math.random() * 5000) + 50, // 50–5050
        charge: Number((Math.random() * 80 + 5).toFixed(2)), // ₹5–₹85
        status: statuses[Math.floor(Math.random() * statuses.length)],
        startCount: Math.floor(Math.random() * 100),
        remains: Math.floor(Math.random() * 50),
        providerOrderId: String(Math.floor(20000 + Math.random() * 90000)),
        createdAt: randomDate(), // last 30 days
      };

      orders.push(newOrder);
    }

    await db.collection("orders").insertMany(orders);

    return {
      success: true,
      message: "20 realistic SMM orders created!",
    };
  } catch (err) {
    console.error("Error generating orders:", err);
    return { error: "Server error: " + err.message };
  }
}




export async function deleteAllOrders() {
  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");

    await db.collection("orders").deleteMany({}); // deletes all documents

    return {
      success: true,
      message: "All orders have been deleted!",
    };
  } catch (err) {
    console.error("Error deleting orders:", err);
    return { error: "Server error: " + err.message };
  }
}







export async function refferalWidrawn(formData) {
  try {
    // 1️⃣ Read Token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized token." };
    }

    // 2️⃣ Verify Token
    let userData;
    try {
      userData = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return { success: false, message: "Invalid or expired token." };
    }

    // 3️⃣ Validate Amount
    const amount = Number(formData.get("amount"));
    if (!amount || amount <= 0) {
      return { success: false, message: "Invalid withdrawal amount." };
    }

    // 4️⃣ Connect to DB
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const usersCollection = db.collection("users");

    // 5️⃣ Validate user existence
    const user = await usersCollection.findOne({ _id: new ObjectId(userData.id) });

    console.log("User:", user);

    if (!user) {
      return { success: false, message: "User not found." };
    }

    // 6️⃣ Check balance
    const currentBalance = Number(user.balance) || 0;

    if (amount > currentBalance) {
      return {
        success: false,
        message: "Withdrawal amount exceeds available balance.",
      };
    }

    // 7️⃣ Deduct balance safely (no $inc problem)
    const newBalance = currentBalance - amount;

    await usersCollection.updateOne(
      { _id: new ObjectId(userData.id) },
      { $set: { balance: newBalance } }
    );

    // 8️⃣ Save withdrawal request
    await db.collection("refferalWidrawn").insertOne({
      userid: new ObjectId(userData.id),
      amount,
      status: "Pending",
      userEmail: userData.email,
      date: Date.now(),
    });

    return {
      success: true,
      message: "Withdrawal submitted successfully.",
      newBalance,
    };

  } catch (error) {
    console.error("Withdraw error:", error);
    return { success: false, message: "Something went wrong." };
  }
}





export async function getUserWithdrawRequests() {
  try {
    // 1️⃣ Read token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized token." };
    }

    // 2️⃣ Verify token
    let userData;
    try {
      userData = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return { success: false, message: "Invalid or expired token." };
    }

    // 3️⃣ Connect DB
    const client = await clientPromise;
    const db = client.db("smmpanel");

    // 4️⃣ Convert token ID → ObjectId
    const userId = new ObjectId(userData.id);

    // 5️⃣ Fetch withdrawal requests
    const requests = await db
      .collection("refferalWidrawn")
      .find({ userid: userId })
      .sort({ date: -1 })
      .toArray();

    // 6️⃣ Convert BSON → Plain JS object
    const cleanRequests = requests.map((req) => ({
      id: req._id.toString(),
      userid: req.userid.toString(),
      amount: Number(req.amount),
      status: req.status,
      userEmail: req.userEmail,
      date: req.date, // timestamp is already serializable
    }));

    return {
      success: true,
      withdrawals: cleanRequests,
    };

  } catch (error) {
    console.error("Get withdrawal requests error:", error);
    return { success: false, message: "Something went wrong." };
  }
}



export async function addFundAction({ utr, amount }) {
  try {
    // 1) Auth
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { status: false, message: "Invalid token" };
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return { status: false, message: "Invalid token" };
    }

    if (!decoded?.id) {
      return { status: false, message: "Invalid user" };
    }

    // 2) Connect DB
    const client = await clientPromise;
    const db = client.db(dbName);

    // 3) Find user
    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.id),
    });

    if (!user) {
      return { status: false, message: "User not found" };
    }

    // 4) Validate amount safely
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return { status: false, message: "Invalid amount" };
    }

    // 5) UTR duplication check
    const existingFund = await db.collection(addFundsCollection).findOne({
      utr,
      userId: user._id,
    });

    if (existingFund) {
      return { status: false, message: "UTR already used" };
    }

    // 6) Validate using BharatPe or Gateway
    const validationResult = await ValidateTransactionBharatPe(utr, numericAmount);

    if (!validationResult?.success) {
      return { status: false, message: "Invalid transaction details" };
    }

    // 7) Ensure balance field exists if missing
    if (user.balance === undefined || user.balance === null || isNaN(user.balance)) {
      await db.collection("users").updateOne(
        { _id: user._id },
        { $set: { balance: 0 } }
      );
    }

    // 8) Add funds atomically (safest way)
    const updateResult = await db.collection("users").updateOne(
      { _id: user._id },
      { $inc: { balance: numericAmount } }
    );

    if (updateResult.matchedCount === 0) {
      return { status: false, message: "Failed to update balance" };
    }

    // 9) Insert add-fund record
    await db.collection(addFundsCollection).insertOne({
      userId: user._id,
      utr,
      amount: numericAmount,
      status: "success",
      gateway: "BharatPe",
      gatewayResponse: validationResult,
      createdAt: new Date(),
    });

    return { status: true, message: "Fund added successfully" };
  } catch (error) {
    console.error("addFundAction error:", error);
    return { status: false, message: "Something went wrong. Please try again." };
  }
}






export async function updateProviderForOrders() {
  const client = await clientPromise;
  const db = client.db("smmpanel");

  const ids = [
    new ObjectId("693124a239a796851aa71e1f"),
    new ObjectId("693122c739a796851aa71e1e"),
  ];

  await db.collection("orders").updateMany(
    { _id: { $in: ids } },
    {
      $set: {
        ProviderUrl: "https://instantsmmboost.com/api/v2",
        providerApiKey: "b422a5c5a0cd42998e268515eca0d34a",
        updatedAt: new Date(),
      },
    }
  );

  return {
    success: true,
    message: "Updated ProviderUrl & providerApiKey for both orders.",
  };
}


















export async function getOrderStatus() {
  const params = new URLSearchParams();
  params.append("key", "b422a5c5a0cd42998e268515eca0d34a");
  params.append("action", "status");
  params.append("order", "6937");

  const res = await axios.post("https://instantsmmboost.com/api/v2", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  console.log(res.data,'from server');
}















export async function getUserChildPanels() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized. Please log in first." };

    // VERIFY TOKEN
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return { error: "Invalid or expired token." };
    }

    // Extract user info from JWT
    const userId = decoded.id;     // or decoded.userId — depends on your JWT payload
    const email = decoded.email;   // if you want email instead of id

    const client = await clientPromise;
    const db = client.db("smmpanel");

    // 🔥 FILTER: fetch requests only for that user
    const filter = { userId }; // (or { email } if you store email in DB)

    const requests = await db
      .collection("child_panel_requests")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    // Convert Mongo objects → plain objects safe for Next.js
    const plain = requests.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
    }));

    return { success: true, requests: plain };
  } catch (err) {
    return { error: "Server error: " + err.message };
  }
}

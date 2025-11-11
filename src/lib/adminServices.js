"use server";

import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt"; 
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import { revalidatePath } from 'next/cache'


const COLLECTION = "affiliate_settings"
// 🗃️ Database and Collection names
const DB_SMM_PANEL = "smmpanel";
const DB_ADMIN = "smmadmin";
const PAYMENT_COLLECTION = "payment_methods";

const SETTINGS_COLLECTION = "settings";


/* -------------------------------------------------------------------------- */
/*                               🧠 Admin Section                              */
/* -------------------------------------------------------------------------- */
export async function getAdminByEmail(email) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const admin = await db.collection("admins").findOne({ email });

    return admin
      ? { success: true, admin }
      : { success: false, error: "Admin not found" };
  } catch (err) {
    console.error("❌ Error fetching admin:", err);
    return { success: false, error: err.message };
  }
}

/* -------------------------------------------------------------------------- */
/*                                 👥 Users                                   */
/* -------------------------------------------------------------------------- */
export async function getAllUsers() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);
    const users = await db.collection("users").find().toArray();

    return {
      success: true,
      count: users.length,
      users: users.map((u) => ({ ...u, _id: u._id.toString() })),
    };
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return { success: false, error: error.message };
  }
}
export async function getDeletedUsers() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);

    // 🧩 Check if 'deleted_users' collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (!collectionNames.includes("deleted_users")) {
      // If it doesn’t exist, create it to prevent runtime errors
      await db.createCollection("deleted_users");
      console.log("🆕 Created 'deleted_users' collection automatically.");
      return { success: true, users: [], message: "No deleted users found yet." };
    }

    // 🟢 Fetch all deleted users
    const deletedUsers = await db.collection("deleted_users").find().toArray();

    if (!deletedUsers.length) {
      return { success: true, users: [], message: "No deleted users found." };
    }

    // 🧠 Convert ObjectIds to strings for client-side rendering
    const formatted = deletedUsers.map((u) => ({
      ...u,
      _id: u._id.toString(),
    }));

    return {
      success: true,
      count: formatted.length,
      users: formatted,
    };
  } catch (error) {
    console.error("❌ Error fetching deleted users:", error);
    return { success: false, error: error.message };
  }
}

export async function getDeletedUserById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);

    // 🧩 Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return { success: false, error: "Invalid user ID" };
    }

    const userId = new ObjectId(id);

    // 🟡 Ensure 'deleted_users' collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (!collectionNames.includes("deleted_users")) {
      await db.createCollection("deleted_users");
      return { success: false, error: "No deleted users found yet." };
    }

    // 🔍 Find user in deleted_users
    const user = await db.collection("deleted_users").findOne({ _id: userId });

    if (!user) {
      return { success: false, error: "Deleted user not found." };
    }

    // 🧠 Convert _id to string for frontend
    const formattedUser = { ...user, _id: user._id.toString() };

    return { success: true, user: formattedUser };
  } catch (error) {
    console.error("❌ Error fetching deleted user by ID:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserById(id) {
  if (!id) return { success: false, error: "User ID is required" };

  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

    if (!user) return { success: false, error: "User not found" };

    return { success: true, user: { ...user, _id: user._id.toString() } };
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    return { success: false, error: "Server error" };
  }
}
 async function deleteOtherPaymentMethods() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);
    const collection = db.collection(PAYMENT_COLLECTION);

    // Delete all except Paytm and BharatPe (case-insensitive)
    const result = await collection.deleteMany({
      type: { $nin: [/^paytm$/i, /^bharatpe$/i] },
    });

    return {
      success: true,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} payment methods deleted successfully.`,
    };
  } catch (err) {
    console.error("❌ Error deleting payment methods:", err);
    return { success: false, error: err.message };
  }
}




/* 🟢 UPDATE USER DETAILS */
export async function updateUserDetails(id, data) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);

    if (!ObjectId.isValid(id)) {
      return { success: false, error: "Invalid user ID" };
    }

    // 🧹 Prevent accidental modification of immutable _id
    if (data._id) delete data._id;

    // 🔐 If password is provided, hash it before updating
    if (data.password && typeof data.password === "string" && data.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    } else {
      // If password is empty string or undefined, remove it to avoid overwriting existing one
      delete data.password;
    }

    // 🟢 Update or create user if missing
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
      { upsert: true }
    );

    return {
      success: true,
      message:
        result.matchedCount === 0
          ? "User not found — created new entry"
          : "User updated successfully",
    };
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return { success: false, error: error.message };
  }
}


/* 🟡 FREEZE OR UNFREEZE USER */
export async function FreezeUser(id, freeze = true) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);

    if (!ObjectId.isValid(id)) {
      return { success: false, error: "Invalid user ID" };
    }

    // Update existing user or add frozen field if missing
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          frozen: freeze,       // create field if missing
          updatedAt: new Date() // track when changed
        }
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      message: freeze
        ? "User account frozen successfully"
        : "User account reactivated successfully"
    };
  } catch (error) {
    console.error("❌ Error freezing/unfreezing user:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteUserById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);

    // 🧩 Validate ID
    if (!ObjectId.isValid(id)) {
      return { success: false, error: "Invalid user ID" };
    }

    const userId = new ObjectId(id);

    // 🟢 Find existing user in 'users' collection
    const existingUser = await db.collection("users").findOne({ _id: userId });

    if (!existingUser) {
      // If no user found, log placeholder in deleted_users
      await db.collection("deleted_users").insertOne({
        _id: userId,
        placeholder: true,
        deletedAt: new Date(),
        note: "User not found — created placeholder deletion log.",
      });

      return {
        success: true,
        message:
          "User not found — created placeholder log in deleted_users collection.",
      };
    }

    // 🟣 Ensure deleted_users collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (!collectionNames.includes("deleted_users")) {
      await db.createCollection("deleted_users");
      console.log("🆕 Created deleted_users collection.");
    }

    // 🟠 Move user document to deleted_users
    const deletedUserDoc = {
      ...existingUser,
      deletedAt: new Date(),
      deletedBy: "admin", // optional: can be dynamic based on session
      originalCollection: "users",
    };

    await db.collection("deleted_users").insertOne(deletedUserDoc);

    // 🔴 Remove from active users
    const result = await db.collection("users").deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return { success: false, error: "User could not be deleted." };
    }

    return {
      success: true,
      message: "User moved to deleted_users collection successfully.",
    };
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return { success: false, error: error.message };
  }
}




export async function restoreUserById(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);

    // 🧩 Validate ID
    if (!ObjectId.isValid(id)) {
      return { success: false, error: "Invalid user ID" };
    }

    const userId = new ObjectId(id);

    // 🟢 Find user in deleted_users
    const deletedUser = await db
      .collection("deleted_users")
      .findOne({ _id: userId });

    if (!deletedUser) {
      // If not found in deleted_users
      return {
        success: false,
        error: "No deleted user found with this ID.",
      };
    }

    // 🟣 Ensure users collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (!collectionNames.includes("users")) {
      await db.createCollection("users");
      console.log("🆕 Created users collection.");
    }

    // 🟠 Prepare restored user document
    const { deletedAt, deletedBy, originalCollection, ...restoredUserDoc } =
      deletedUser;

    restoredUserDoc.restoredAt = new Date();
    restoredUserDoc.restoredBy = "admin"; // can be dynamic based on session

    // 🔵 Move user back to users collection
    await db.collection("users").insertOne(restoredUserDoc);

    // 🔴 Remove from deleted_users
    const result = await db
      .collection("deleted_users")
      .deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return {
        success: false,
        error: "User could not be removed from deleted_users.",
      };
    }

    return {
      success: true,
      message: "User restored to users collection successfully.",
    };
  } catch (error) {
    console.error("❌ Error restoring user:", error);
    return { success: false, error: error.message };
  }
}



























/* -------------------------------------------------------------------------- */
/*                              💳 Payment Methods                            */
/* -------------------------------------------------------------------------- */
export async function getAllPaymentMethods() {
 
  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);
    const methods = await db.collection(PAYMENT_COLLECTION).find().toArray();

    // Convert _id to string and return plain object
    return {
      success: true,
      count: methods.length,
      methods: methods.map((m) => ({
        ...m,
        _id: m._id.toString(),
        qrImage: m.qrImage ? m.qrImage.toString("base64") : null,
      })),
    };
  } catch (err) {
    console.error("❌ Error fetching payment methods:", err);
    return { success: false, error: err.message };
  }
}

export async function getPaymentMethodDetails(id) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);
    console.log(id)
 const cleanId = id.replace(/"/g, "").trim();
    // Ensure valid ObjectId
    if (!ObjectId.isValid(cleanId)) {
      return { success: false, error: "Invalid ID format" };
    }

    const method = await db
      .collection(PAYMENT_COLLECTION)
      .findOne({ _id: new ObjectId(id) });

    if (!method) {
      return { success: false, error: "Payment method not found" };
    }

    return {
      success: true,
      method: {
        ...method,
        _id: method._id.toString(),
        qrImage: method.qrImage ? method.qrImage.toString("base64") : null,
      },
    };
  } catch (err) {
    console.error("❌ Error fetching payment details:", err);
    return { success: false, error: err.message };
  }
}

export async function putPaymentMethodDetails(
  type,
  { merchantId, token, active = true, qrBase64 = null,instruction,Name }
) {
  try {
    if (!type || !merchantId || !token ||!Name || !instruction) {
      return { success: false, error: "Missing required fields" };
    }

    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);
    const collection = db.collection(PAYMENT_COLLECTION);

    const updateData = {
      type: type.trim(),
      merchantId: merchantId.trim(),
      token: token.trim(),
      active: Boolean(active),
      Name:Name,
      instruction,instruction,
      updatedAt: new Date(),

    };

    // Only add qrImage if valid base64 provided
    if (qrBase64 && /^[A-Za-z0-9+/=]+$/.test(qrBase64)) {
      updateData.qrImage = Buffer.from(qrBase64, "base64");
    }

    const result = await collection.updateOne(
      { type: { $regex: `^${type}$`, $options: "i" } }, // case-insensitive match
      { $set: updateData },
      { upsert: true }
    );

    return {
      success: true,
      message: result.upsertedCount
        ? "New payment method added"
        : "Payment method updated",
      modifiedCount: result.modifiedCount,
      upsertedId: result.upsertedId || null,
    };
  } catch (err) {
    console.error("❌ Error updating payment details:", err);
    return { success: false, error: err.message };
  }
}

/* -------------------------------------------------------------------------- */
/*                            ✅ Transaction Validation                        */
/* -------------------------------------------------------------------------- */
export async function ValidateTransactionBharatPe(internalUtr, amount) {
  try {
    const merchantId = process.env.MARCHANT_ID;
    const token = process.env.BHARATPE_TOKEN || "06bc2221af4f426dab9a40a38bff5ac5";
console.log('hello',internalUtr,amount)
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 25);

    const formatDate = (d) => d.toISOString().split("T")[0];
    const apiUrl = `https://payments-tesseract.bharatpe.in/api/v1/merchant/transactions?module=PAYMENT_QR&merchantId=${merchantId}&sDate=${formatDate(fromDate)}&eDate=${formatDate(toDate)}`;

    const res = await fetch(apiUrl, {
      headers: {
        token,
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
      },
    });

    if (!res.ok) {
      console.error("❌ BharatPe API Error:", await res.text());
      return { success: false, error: "API request failed" };
    }

    const data = await res.json();
    const transactions = data?.data?.transactions || [];

    const matched = transactions.find(
      (t) => t.internalUtr === internalUtr && Number(t.amount) === Number(amount)
    );

    if (!matched)
      return { success: false, error: "No transaction found for given UTR and amount" };

    console.log("✅ BharatPe Match Found:", matched);
    return { success: true, transaction: matched };
  } catch (error) {
    console.error("❌ BharatPe Validation Error:", error);
    return { success: false, error: error.message };
  }
}
































// 🟢 GET — Fetch settings from MongoDB
export async function getWebsiteSettings() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);
    const collection = db.collection(SETTINGS_COLLECTION);

    let settings = await collection.findOne({});

    // 🧩 Create default settings if not found
    if (!settings) {
      const defaultSettings = {
        siteName: "My Website",
        panelName: "Admin Panel",
        maintenanceMode: false,
        servicesEnabled: true,
        // Default base64 placeholders (transparent 1x1 PNG)
        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2N89hEABAgBDAFGhWoAAAAASUVORK5CYII=",
        favicon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2N89hEABAgBDAFGhWoAAAAASUVORK5CYII=",
        bronzeMember: "Bronze",
        silverMember: "Silver",
        goldMember: "Gold",
        reseller: "Reseller",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await collection.insertOne(defaultSettings);
      settings = defaultSettings;
    }
const plainsettings=JSON.stringify(settings)
    return {
      success:true,
      plainsettings
    } ;
  } catch (err) {
    console.error("getWebsiteSettings error:", err);
    return {
      success:false,

    }
  }
}

// 🟠 POST — Insert or update settings (store images in DB as Base64)
export async function updateWebsiteSettings(formData) {
  
  try {
    const client = await clientPromise;
    const db = client.db(DB_SMM_PANEL);
    const collection = db.collection(SETTINGS_COLLECTION);

    // 🧠 Extract form data fields
    const siteName = formData.siteName
    const panelName = formData.panelName
    const maintenanceMode = formData.maintenanceMode
    const servicesEnabled = formData.servicesEnabled
    const bronzeMember = formData.bronzeMember
    const silverMember = formData.silverMember
    const goldMember = formData.goldMember
    const reseller = formData.reseller

    // 🧩 Prepare updated data
    let updated = {
      siteName,
      panelName,
      maintenanceMode,
      servicesEnabled,
      bronzeMember,
      silverMember,
      goldMember,
      reseller,
      updatedAt: new Date(),
    };

    // 🟡 Handle logo upload (convert to Base64)
    const logo = formData?.logo
    if (logo && typeof logo !== "string") {
      const bytes = await logo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const mimeType = logo.type || "image/png";
      updated.logo = `data:${mimeType};base64,${base64}`;
    }

    // 🟠 Handle favicon upload (convert to Base64)
    const favicon = formData?.favicon
    if (favicon && typeof favicon !== "string") {
      const bytes = await favicon.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const mimeType = favicon.type || "image/png";
      updated.favicon = `data:${mimeType};base64,${base64}`;
    }

    // 🧠 Fetch existing settings
    const existing = await collection.findOne({});

    // 💾 Insert or Update
    if (!existing) {
      updated.createdAt = new Date();
      await collection.insertOne(updated);
    } else {
      await collection.updateOne({}, { $set: updated }, { upsert: true });
    }

    return { success: true, settings: updated };
  } catch (err) {
    console.error("updateWebsiteSettings error:", err);
    return {
      success:false
    }
  }
}





export async function getAllTickets() {
  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");

    const tickets = await db
      .collection("tickets")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // 🧩 Convert MongoDB ObjectIds to string + format fields if needed
    const newTickets = tickets.map((t) => ({
      _id: t._id.toString(),
      username: t.username || "Unknown",
      subject: t.subject || "No subject",
      message: t.message || "",
      status: t.status || "open",
      replies: t.replies || [],
      created_at: t.createdAt || t.created_at || null,
      updatedAt: t.updatedAt || null,
    }));

    return {
      success: true,
      count: newTickets.length,
      tickets: newTickets,
    };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw new Error("Failed to fetch tickets");
  }
}




export async function getUserTickets() {
  try {
    // 🍪 Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { error: "Unauthorized. No token found." };
    }

    // 🔓 Verify and decode JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return { error: "Invalid or expired token." };
    }
console.log(decoded)
    const userId = decoded.id;
    const username = decoded.username;
console.log(userId)
    if (!userId && !username) {
      return { error: "Invalid token: missing user information." };
    }

    // 🧩 Connect to DB
    const client = await clientPromise;
    const db = client.db("smmpanel");

    let query = {};

    // Try matching by userId first
    if (userId && ObjectId.isValid(userId)) {
      query.userId = new ObjectId(userId);
    } else if (username) {
      // fallback by username
      query.username = username;
    }

    // 🔍 Fetch tickets
    let tickets = await db
      .collection("tickets")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // 🧠 If none found with userId, try again by username
    if (tickets.length === 0 && username && query.userId) {
      tickets = await db
        .collection("tickets")
        .find({ username })
        .sort({ createdAt: -1 })
        .toArray();
    }

    return {
      success: true,
      count: tickets.length,
      tickets: formatTickets(tickets),
    };
  } catch (error) {
    console.error("❌ Error fetching user tickets:", error);
    return { error: "Failed to fetch user tickets" };
  }
}

// 🧩 Helper function to format tickets
function formatTickets(tickets) {
  return tickets.map((t) => ({
    _id: t._id.toString(),
    username: t.username || "Unknown",
    userId: t.userId ? t.userId.toString() : null,
    subject: t.subject || "No subject",
    message: t.message || "",
    status: t.status || "open",
    replies: t.replies || [],
    created_at: t.createdAt || t.created_at || null,
    updatedAt: t.updatedAt || null,
  }));
}





export async function getUnansweredTickets() {
  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");

    // 🧠 Match tickets that are still open or have no replies
    const unanswered = await db
      .collection("tickets")
      .find({
        $or: [
          { status: "open" },
          { status: "unanswered" },
          { replies: { $exists: true, $size: 0 } },
          { adminReplied: { $ne: true } },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    // 🧩 Normalize data for frontend (convert ObjectIds, fill defaults)
    const cleanTickets = unanswered.map((t) => ({
      _id: t._id?.toString(),
      username: t.username || "Unknown",
      subject: t.subject || "No subject",
      message: t.message || "",
      status: t.status || "open",
      replies: Array.isArray(t.replies) ? t.replies : [],
      created_at: t.createdAt || t.created_at || null,
      updatedAt: t.updatedAt || null,
    }));

    return {
      success: true,
      count: cleanTickets.length,
      tickets: cleanTickets,
    };
  } catch (error) {
    console.error("❌ Error fetching unanswered tickets:", error);
    throw new Error("Failed to fetch unanswered tickets");
  }
}





export async function replyToTicket({ ticketId, message }) {
  try {
    if (!ticketId || !message)
      return { error: "Missing required fields (ticketId or message)" };

    // 🍪 Get and verify admin token
    const cookieStore = await cookies()
   const token= cookieStore.get("token")?.value;
    if (!token) return { error: "Unauthorized: no token found." };

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return { error: "Invalid or expired token." };
    }

    if (decoded.role !== "admin")
      return { error: "Access denied: only admins can reply." };

    // 🗄️ Connect to database
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const tickets = db.collection("tickets");

    // 🧩 Create reply object
    const reply = {
      message,
      type: "admin",
      sender: decoded.username || "Admin",
      created_at: new Date(),
    };

    // 🔄 Update the ticket (append reply + set status)
    const result = await tickets.updateOne(
      { _id: new ObjectId(ticketId) },
      {
        $push: { replies: reply },
        $set: { status: "answered", updatedAt: new Date() },
      }
    );

    if (result.modifiedCount === 0)
      return { error: "Failed to update ticket or ticket not found." };

    return {
      success: true,
      message: "Reply added successfully.",
      reply,
    };
  } catch (err) {
    console.error("❌ Error in replyToTicket:", err);
    return { error: "Server error while replying to ticket." };
  }
}

export async function updateAdminReply({ ticketId, newMessage }) {
  try {
    if (!ticketId || !newMessage)
      return { error: "Missing required fields." };

    const token = await cookies().get("token")?.value;
    if (!token) return { error: "Unauthorized: No token found." };

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return { error: "Invalid or expired token." };
    }

    if (decoded.role !== "admin")
      return { error: "Access denied: Only admins can edit replies." };

    const client = await clientPromise;
    const db = client.db("smmpanel");

    const result = await db.collection("tickets").updateOne(
      { _id: new ObjectId(ticketId), "replies.type": "admin" },
      {
        $set: {
          "replies.$.message": newMessage,
          "replies.$.updated_at": new Date(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0)
      return { error: "Reply not found or update failed." };

    return {
      success: true,
      message: "Reply updated successfully.",
      updatedMessage: newMessage,
    };
  } catch (error) {
    console.error("Error updating admin reply:", error);
    return { error: "Server error while updating reply." };
  }
}









export async function createTicket({ subject, message }) {
  try {
    // 🧠 1. Validate fields
    if (!subject || !message) {
      return { error: "Missing required fields." };
    }

    // 🍪 2. Get token from cookies
    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { error: "Unauthorized. No token found." };

    // 🔓 3. Verify and decode JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return { error: "Invalid or expired token." };
    }

    const userId = decoded.id;
    const username = decoded.username;
    const role = decoded.role || "user"; // optional fallback

    if (!userId && !username)
      return { error: "Invalid user token. Please log in again." };

    // 🗄️ 4. Connect to database
    const client = await clientPromise;
    const db = client.db("smmpanel");

    // 🧩 5. Build ticket document
    const ticket = {
      userId: userId ? new ObjectId(userId) : null,
      username: username || "Unknown",
      subject,
      message,
      type: "user", // ✅ added ticket type
      status: "open",
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 💾 6. Insert ticket
    const result = await db.collection("tickets").insertOne(ticket);

    // ✅ 7. Return success response
    return {
      success: true,
      message: "Ticket created successfully.",
      ticket: {
        ...ticket,
        _id: result.insertedId.toString(),
      },
    };
  } catch (error) {
    console.error("❌ Error creating ticket:", error);
    return { error: "Failed to create ticket." };
  }
}




















export async function getChildPanels() {
  try {
    // 🍪 Get token from cookies
    const token =await cookies().get("token")?.value;
    if (!token) {
      return { error: "Unauthorized. Please log in first." };
    }

    // 🔐 Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return { error: "Invalid or expired token." };
    }

    const { email, role } = decoded;

    // 🗃️ Connect to DB
    const client = await clientPromise;
    const db = client.db("smmpanel");

    // 🧾 Fetch all requests (admin sees all, user sees their own)
    const filter = role === "admin" ? {} : { email };
    const requests = await db
      .collection("child_panel_requests")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return { success: true, requests };
  } catch (err) {
    console.error("❌ Error fetching panels:", err);
    return { error: "Server error: " + err.message };
  }
}
export async function setChildPanelSettings(formData) {
  try {
    const token =await cookies().get("token")?.value;
    if (!token) return { error: "Unauthorized" };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return { error: "Access denied." };

    const domain = formData.get("domain");
    const price = formData.get("price");

    const client = await clientPromise;
    const db = client.db("smmpanel");

    await db.collection("settings").updateOne(
      { key: "child_panel_settings" },
      { $set: { domain, price, updatedAt: new Date() } },
      { upsert: true }
    );

    return { success: true, message: "Settings updated successfully." };
  } catch (err) {
    console.error("❌ setChildPanelSettings error:", err);
    return { error: err.message };
  }
}




export async function getChildPanelSettings() {
  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");

    // Fetch existing settings from DB
    const settings = await db.collection("settings").findOne({
      key: "child_panel_settings",
    });

    if (!settings) {
      return {
        domain: "yourpaneldomain.com",
        price: "₹ 800",
        message: "Default values (not yet set by admin)",
      };
    }

    return {
      domain: settings.domain,
      price: settings.price,
      updatedAt: settings.updatedAt,
    };
  } catch (err) {
    console.error("❌ getChildPanelSettings error:", err);
    return { error: err.message };
  }
}























export async function createChildPanel({ formData, payment_amount, utr, payment_type }) {
  console.log(payment_type)
  try {
    // 🧮 Parse and validate numeric payment amount
    const formPrice = parseFloat(formData.get("price").replace(/[^\d.]/g, ""));
    const paidAmount = parseFloat(payment_amount);

    // ⚠️ Step 1: Amount validation
    if (isNaN(paidAmount) || paidAmount <= 0) {
      return { error: "Invalid payment amount." };
    }
    if (paidAmount < formPrice) {
      return { error: `Payment amount is less than required price (${formPrice}).` };
    }

    // 🍪 Step 2: Get token from cookies
    const cookie = await cookies()
    const token=cookie.get("token")?.value;
    if (!token) {
      return { error: "Unauthorized. Please login first." };
    }

    // 🔍 Step 3: Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return { error: "Invalid or expired token." };
    }

    // 🧠 Step 4: Extract user info
    const { id, username, email } = decoded;

    // 🗃️ Step 5: Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("smmpanel");

    // 🚫 Step 6: Prevent reused UTR
    const existingUTR = await db.collection("used_utr").findOne({ utr });
    if (existingUTR) {
      return { error: "This UTR has already been used. Please use a new one." };
    }

   // 💳 Step 7: Verify Transaction from BharatPe (if payment_type = "BharatPe")
let matchedTx = null;

if (payment_type?.toLowerCase() === "bharatpe") {
  try {
    matchedTx = await ValidateTransactionBharatPe(utr, paidAmount);

    // 🧩 If the function failed
    if (!matchedTx || matchedTx.success === false) {
      const errorMsg =
        matchedTx?.error ||
        "Transaction not found or payment verification failed.";
      return { error: errorMsg };
    }
  } catch (err) {
    console.error("❌ BharatPe validation error:", err);
    return { error: "BharatPe verification failed — please try again later." };
  }
}

    
    console.log(matchedTx,utr,payment_amount) 

    // 🧾 Step 8: Mark UTR as used
    await db.collection("used_utr").insertOne({
      utr,
      payment_type,
      payment_amount: paidAmount,
      used_by: email,
      used_at: new Date(),
    });

    // 📝 Step 9: Prepare and store the child panel request
    const request = {
      userId: id,
      username,
      email,
      domain: formData.get("domain"),
      currency: formData.get("currency"),
      panel_username: formData.get("username"),
      panel_password: formData.get("password"),
      payment_type,
      payment_amount: paidAmount,
      utr,
      bharatPeId: matchedTx?.id || null,
      price: formData.get("price"),
      createdAt: new Date(),
      status: "confirmed",
      verified: true,
    };

    await db.collection("child_panel_requests").insertOne(request);

    // ✅ Step 10: Return success response
    return {
      success: true,
      message: "Child panel request submitted and payment verified successfully.",
      data: { utr, payment_type, amount: paidAmount },
    };
  } catch (err) {
    console.error("❌ Error submitting child panel:", err);
    return { error: "Server error: " + err.message };
  }
}



















// 🧱 Get current affiliate settings
export async function getAffiliateSettings() {
  try {
    const client = await clientPromise
    const db = client.db(DB_ADMIN)
    const settings = await db.collection(COLLECTION).findOne({ _id: "affiliate_settings" })

    // Default if not set yet
    return settings || { commission_rate: 5, minimum_payout: 50 }
  } catch (err) {
    console.error("Failed to fetch affiliate settings:", err)
    return { commission_rate: 5, minimum_payout: 50 }
  }
}

// 🧰 Admin updates settings
export async function updateAffiliateSettings({ commission_rate, minimum_payout }) {
  try {
    const client = await clientPromise
    const db = client.db(DB_ADMIN)

    await db.collection(COLLECTION).updateOne(
      { _id: "affiliate_settings" },
      {
        $set: {
          commission_rate: Number(commission_rate),
          minimum_payout: Number(minimum_payout),
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    revalidatePath('/admin/affiliate') // if admin has a page
    return { success: true }
  } catch (err) {
    console.error("Failed to update affiliate settings:", err)
    return { success: false, error: err.message }
  }
}

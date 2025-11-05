"use server";

import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
import fs from 'fs/promises'
import path from 'path'
import bcrypt from "bcrypt"; 
// 🗃️ Database and Collection names
const DB_SMM_PANEL = "smmpanel";
const DB_ADMIN = "smmadmin";
const PAYMENT_COLLECTION = "payment_methods";



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
  { merchantId, token, active = true, qrBase64 = null }
) {
  try {
    if (!type || !merchantId || !token) {
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



































export async function getSetting(key) {
  try {
    // Resolve the path to settings.json
    const filePath = path.join(process.cwd(), "data", "settings.json");

    // Read the file
    const fileData = await fs.readFile(filePath, "utf-8");
    const settings = JSON.parse(fileData);

    // If key exists, return it, otherwise return a fallback
    if (key in settings) {
      return settings[key];
    } else {
      return `Setting "${key}" not found`;
    }
  } catch (error) {
    console.error("Error reading settings:", error);
    return "Error loading setting";
  }
}

export async function getSettings(keys = []) {
  try {
    const filePath = path.join(process.cwd(), "data", "settings.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const settings = JSON.parse(fileData);

    // If keys are provided, filter them
    if (Array.isArray(keys) && keys.length > 0) {
      const result = {};
      for (const key of keys) {
        result[key] = settings[key] || null;
      }
      console.log(result)
      return result;
    }

    // Otherwise return everything
    return settings;
  } catch (error) {
    console.error("Error reading settings:", error);
    return {};
  }
}
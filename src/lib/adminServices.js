"use server";

import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
import fs from 'fs/promises'
import path from 'path'
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
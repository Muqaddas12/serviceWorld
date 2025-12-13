// /lib/services.js
'use server'
import axios from "axios";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import clientPromise from "./mongodb";
const API_URL = process.env.BASE_URL
const API_KEY = process.env.KEY
const DB_ADMIN = "smmadmin";

//
// 🔹 API Actions
//
export async function getServices() {
  try {
    const client = await clientPromise;
    const servicesCollection = client.db(DB_ADMIN).collection("services");

    const data = await servicesCollection.find({}).toArray();

    // ✅ MANUAL CONVERSION TO PLAIN OBJECT
    const plain = data.map(s => ({
      _id: s._id ? s._id.toString() : null,  // convert ObjectId → string
      id: s.id ?? null,
      name: s.name ?? "",
      category: s.category ?? "",
      min: Number(s.min) || 0,
      max: s.max?.toString() || "0",
      rate: Number(s.rate) || 0,
      provider: s.provider ?? "",
      service: s.service ?? null,
      average_time:s?.average_time,
      type: s.type ?? "Default",
      desc: s.desc ?? "",
      storedBy: s.storedBy ?? "",
      status:s.status?? 'enabled',
      profitPercentage:s?.profitPercentage,
      createdAt: s.createdAt ? s.createdAt.toISOString() : null // date → string
    }));


    return {
      status: true,
      plain,  // ✅ Now safe pure plain objects
      message: "Fetched from DB ✅"
    };

  } catch (error) {
    console.error("DB FETCH ERROR:", error.message);
    return {
      status: false,
      services: [],
      message: error.message
    };
  }
}



export async function deleteAllServices() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return { status: false, message: "Unauthorized user" };
    }

    let admin;
    try {
      admin = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return { status: false, message: "Invalid or expired token" };
    }

    if (!admin) {
      return { status: false, message: "Admin Not Logged In" };
    }

    // ✅ Connect DB
    const client = await clientPromise;
    const collection = client.db(DB_ADMIN).collection("services");

    // ✅ Delete all
    const result = await collection.deleteMany({});

    return {
      status: true,
      deletedCount: result.deletedCount, // number of deleted docs
      message: `Deleted ${result.deletedCount} services successfully ✅`,
    };
  } catch (error) {
    console.error("DELETE ALL ERROR:", error.message);
    return { status: false, message: "Server error", error: error.message };
  }
}


export async function importServicesAction({url,api}) {
  try {
    const params = new URLSearchParams();
    params.append("key", api);
    params.append("action", "services");

    const res = await axios.post(url, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return res.data;
  } catch (error) {
    console.error("SMM API Error:", error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
}


export async function StoreServicesInDB({ services, profitPercentage }) {
  console.log(services)
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return { status: false, message: "invalid token" };
    }

    const admin = jwt.verify(token, process.env.JWT_SECRET);
    if (!admin) {
      return { status: false, message: "unauthorized admin" };
    }

    const client = await clientPromise;

    const servicesCollection = client.db(DB_ADMIN).collection("services");
    const categoriesCollection = client.db(DB_ADMIN).collection("categories");

    // ---------- PREPARE SERVICES PAYLOAD ----------
   const payload = services.map((s) => {
  const rate = Number(s.rate) || 0;
  const pr = Number(profitPercentage || 1); // already provided

  // ✔ Final price including profit
  const finalRate = rate * (1 + pr / 100);

  return {
    id: s.id ?? Date.now(),
    name: s.name?.trim() || "Unnamed Service",
    category: s.category?.trim() || "Uncategorized",
    min: Number(s.min) || 0,
    max: s.max?.toString() || "0",
    rate, // original rate
    finalRate: Number(finalRate.toFixed(4)),   // NEW FIELD (saved clean)
    provider: s.provider?.trim() || "Unknown",
    service: s.service ?? null,
    type: s.type?.trim() || "Default",
    status: "enabled",
    desc: s.desc?.trim() || "",
    profitPercentage:pr,  // keep original
    storedBy: admin.id ?? "system",
    createdAt: new Date(),
  };
});


    // ---------- INSERT SERVICES ----------
    await servicesCollection.insertMany(payload);

    // ---------- CATEGORY INSERT LOGIC ----------
    const uniqueCategories = [
      ...new Set(payload.map((s) => s.category)),
    ];

    for (const cat of uniqueCategories) {
      const exists = await categoriesCollection.findOne({ category: cat });

      if (!exists) {
        await categoriesCollection.insertOne({
          category: cat,
          createdAt: new Date(),
        });
      }
    }

    return { status: true, message: "Services stored successfully ✅" };

  } catch (error) {
    console.error("DB STORE ERROR:", error);
    return { status: false, message: error.message || "Something went wrong" };
  }
}



// ✅ Create a new order
export async function createOrder(data) {

  try {
    const { service, link, quantity } = data;

    if (!service || !link || !quantity) {
      throw new Error("Missing required fields: service, link, or quantity");
    }
const client = await clientPromise;

const selectedProvider = await client
  .db(DB_ADMIN)
  .collection("Providers")
  .find({}).toArray();

  const serviceData = await client
  .db(DB_ADMIN)
  .collection("services")
  .findOne({ service: (service) });



const result=selectedProvider.find((p)=>p.providerUrl===serviceData.provider)
// IMPORTANT SAFE CHECK
if (!result) {
   return {
      error: error.response?.data || error.message,
      success: false,
    };
}

    const params = new URLSearchParams();
    params.append("key", result.apiKey);
    params.append("action", "add");
    params.append("service", service);
    params.append("link", link);
    params.append("quantity", quantity);

    // 🚀 Send the order to your SMM provider
    const res = await axios.post(result.providerUrl, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 15000, // 15s timeout
    });

    // ✅ Return API response
    return res.data;
  } catch (error) {
    console.error("SMM API Order Error:", error.response?.data || error.message);

    return {
      error: error.response?.data || error.message,
      success: false,
    };
  }
}


// // ✅ Get single order status
// export const getOrderStatus = (orderId) => postAction("status", { order: orderId });

// // ✅ Get multiple order statuses
// export const getMultipleOrderStatus = (orderIds) =>
//   postAction("status", { orders: orderIds.join(",") });

// // ✅ Create a refill for one order
// export const createRefill = (orderId) => postAction("refill", { order: orderId });

// // ✅ Create multiple refills
// export const createMultipleRefills = (orderIds) =>
//   postAction("refill", { orders: orderIds.join(",") });

// // ✅ Get refill status
// export const getRefillStatus = (refillId) => postAction("refill_status", { refill: refillId });

// // ✅ Get multiple refill statuses
// export const getMultipleRefillStatuses = (refillIds) =>
//   postAction("refill_status", { refills: refillIds.join(",") });

// // ✅ Get user balance
// export const getBalance = () => postAction("balance");











export async function deleteCategoryAllServices({ category }) {
  try {
    if (!category) {
      return { status: false, message: "Category is required" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return { status: false, message: "Unauthorized user" };
    }

    let admin;
    try {
      admin = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return { status: false, message: "Invalid or expired token" };
    }

    if (!admin) {
      return { status: false, message: "Admin Not Logged In" };
    }

    // DB
    const client = await clientPromise;

    const servicesCollection = client.db(DB_ADMIN).collection("services");
    const categoriesCollection = client.db(DB_ADMIN).collection("categories");

    // 1️⃣ Delete all services of this category
    const servicesDeleteResult = await servicesCollection.deleteMany({
      category,
    });

    // 2️⃣ Check if category exists
    const existingCategory = await categoriesCollection.findOne({ category });

    if (!existingCategory) {
      return {
        status: true,
        deletedCount: servicesDeleteResult.deletedCount,
        message: `Services deleted. Category "${category}" not found in categories list.`,
      };
    }

    // 3️⃣ Delete category from categories collection
    await categoriesCollection.deleteOne({ category });

    return {
      status: true,
      deletedCount: servicesDeleteResult.deletedCount,
      message: `Deleted category "${category}" and ${servicesDeleteResult.deletedCount} related services successfully ✅`,
    };
  } catch (error) {
    console.error("DELETE CATEGORY + SERVICES ERROR:", error.message);
    return { status: false, message: "Server error", error: error.message };
  }
}













export async function AddCategory({ category }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return {
        status: false,
        message: "Unauthorized user",
      };
    }

    let admin;
    try {
      admin = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return {
        status: false,
        message: "Invalid or expired token",
      };
    }

    if (!admin) {
      return {
        status: false,
        message: "Admin Not Logged In",
      };
    }

    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection("categories"); // ✅ specify collection

    // Ensure input is array for insertMany
    const categoryArray = Array.isArray(category)
      ? category
      : [category];

    if (categoryArray.length > 1) {
      await collection.insertMany(categoryArray.map(cat => ({ category: cat })));
    } else {
      await collection.insertOne({ category: categoryArray[0] });
    }

    return {
      status: true,
      message: "Category added successfully",
    };

  } catch (error) {
    return {
      status: false,
      message: "Server error",
      error: error.message,
    };
  }
}








export async function getCategories() {
  try {
    // ✅ Connect to DB
    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection("categories");

    // ✅ Fetch from MongoDB
    const categories = await collection.find({}).toArray();

    // ✅ Return only the category field as plain array
    return {
      status: true,
      message: "Fetched successfully",
      data: categories.map(cat => cat.category.trim()),
    };

  } catch (error) {
    return {
      status: false,
      message: "Server error",
      error: error.message,
    };
  }
}
export async function upadateCategories({ allcategories }) {
  try {
    // -----------------------------
    // 1. CHECK ADMIN TOKEN
    // -----------------------------
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return { status: false, message: "Unauthorized user" };
    }

    let admin;
    try {
      admin = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return { status: false, message: "Invalid or expired token" };
    }

    if (!admin) {
      return { status: false, message: "Admin not logged in" };
    }

    // -----------------------------
    // 2. VALIDATE INPUT
    // -----------------------------
    if (!Array.isArray(allcategories)) {
      return { status: false, message: "Invalid data format" };
    }

    // -----------------------------
    // 3. CONNECT TO DATABASE
    // -----------------------------
    const client = await clientPromise;
    const db = client.db( DB_ADMIN);
    const collection = db.collection("categories");

    // -----------------------------
    // 4. DELETE ALL OLD CATEGORIES
    // -----------------------------
    await collection.deleteMany({});

    // -----------------------------
    // 5. INSERT NEW CATEGORIES IN ORDER
    // -----------------------------
    const docs = allcategories.map((cat) => ({
      category: cat.trim(),
    }));

    await collection.insertMany(docs);

    return {
      status: true,
      message: "Categories updated successfully",
    };

  } catch (error) {
    console.error("Update categories error:", error);
    return {
      status: false,
      message: "Server error",
      error: error.message,
    };
  }
}












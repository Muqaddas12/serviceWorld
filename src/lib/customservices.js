'use server';

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import clientPromise from "./mongodb";

const DB_ADMIN = "smmadmin";
const COLLECTION = "Services";

/* -------------------------------------------------------
   🔐 Helper → verify admin
-------------------------------------------------------- */
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return { valid: false, message: "Invalid admin" };

  try {
    const admin = jwt.verify(token, process.env.JWT_SECRET);
    return admin ? { valid: true } : { valid: false, message: "Unauthorized" };
  } catch {
    return { valid: false, message: "Unauthorized" };
  }
}

/* -------------------------------------------------------
   ✅ ADD SERVICE
-------------------------------------------------------- */
    export async function AddNewServiceAction(data) {
    try {
        // 1) Verify admin
        const auth = await verifyAdmin();
        if (!auth.valid) return { status: false, message: auth.message };

        // 2) MongoDB connection
        const client = await clientPromise;
        const db = client.db(DB_ADMIN);
        const collection = db.collection(COLLECTION);

        // 3) Clean + normalize input
        const serviceId = Number(data.id);
      
        const rate = Number(data.rate);
        const min = data.min ? Number(data.min) : null;
        const max = data.max ? Number(data.max) : null;
console.log(data)
        // 4) Validation
        if (!serviceId || !data.name || !data.provider || !rate) {
        return { status: false, message: "Missing required fields" };
        }

        // 5) Check Duplicate Service ID
        const exists = await collection.findOne({ id: serviceId });
        if (exists) {
        return { status: false, message: "Service ID already exists" };
        }

        // 6) Insert
        await collection.insertOne({
        id: serviceId,
        name: data.name,
        desc: data.description || "",
        category: data.category || "",
        type: data.type || "service",
        refill: Boolean(data.refill),
        cancelAllowed: Boolean(data.cancelAllowed),
        provider: data.provider,
        rate,
        min,
        max,
        status: data.status || "enabled",
        createdAt: new Date(),
        });

        // 7) Success response
        return { status: true, message: "Service added successfully" };
    } catch (error) {
        console.error("AddNewServiceAction Error:", error);
        return { status: false, message: "Internal server error" };
    }
    }


    
/* -------------------------------------------------------
   📥 GET ALL SERVICES (PLAIN OBJECTS)
-------------------------------------------------------- */
export async function GetServicesAction() {
  try {
    const auth = await verifyAdmin();
    if (!auth.valid) return [];

    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection(COLLECTION);

    const services = await collection.find({}).sort({ id: 1 }).toArray();

    // return clean objects (no _id)
    return services.map((s) => ({
      service: s.id,
      name: s.name,
      type: s.type,
      refill: s.refill,
      desc:s.desc,
      cancelAllowed: s.cancelAllowed,
      provider: s.provider,
      category:s.category,
      rate: s.rate,
      min: s.min,
      max: s.max,
      status: s.status,
      createdAt: s.createdAt ? s.createdAt.toString() : null,
      updatedAt: s.updatedAt ? s.updatedAt.toString() : null,
      customservice:true,
    }));
  } catch (error) {
    console.error("GetServicesAction:", error);
    return [];
  }
}


/* -------------------------------------------------------
   🔄 UPDATE SERVICE
-------------------------------------------------------- */
export async function UpdateServiceAction(data) {
    console.log(data)
  try {
    const auth = await verifyAdmin();
    if (!auth.valid) return { status: false, message: auth.message };

    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection(COLLECTION);

    const id = Number(data.service);

    const exists = await collection.findOne({ id });
    if (!exists) return { status: false, message: "Service not found" };

    // Convert FormData values → proper types
    const updatePayload = {
      name: data.name,
      description: data.description || "",
      category: data.category || "",
      type: data.type || "service",

      // convert yes/no → boolean
      refill: data.refill === "yes",
      cancelAllowed: data.cancelallowed === "yes",

      // provider stays unchanged
      provider: exists.provider,

      // convert numeric fields
      price: Number(data.rate),
      min: Number(data.min),
      max: Number(data.max),

      status: data.status || "enabled",

      updatedAt: new Date()
    };

    const result = await collection.updateOne(
      { id },
      { $set: updatePayload }
    );

    if (result.modifiedCount === 0) {
      return { status: false, message: "No changes made" };
    }

    return { status: true, message: "Service updated successfully" };

  } catch (error) {
    console.error("UpdateServiceAction:", error);
    return { status: false, message: "Internal server error" };
  }
}


/* -------------------------------------------------------
   ❌ DELETE SERVICE
-------------------------------------------------------- */
export async function DeleteServiceAction(serviceId) {
    console.log(serviceId)
  try {
    const auth = await verifyAdmin();
    if (!auth.valid) return { status: false, message: auth.message };

    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection(COLLECTION);

    const result = await collection.deleteOne({ id: (serviceId) });

    if (result.deletedCount === 0) {
      return { status: false, message: "Service not found" };
    }

    return { status: true, message: "Service deleted successfully" };
  } catch (error) {
    console.error("DeleteServiceAction:", error);
    return { status: false, message: "Internal server error" };
  }
}

/* -------------------------------------------------------
   📌 GET SINGLE SERVICE
-------------------------------------------------------- */
export async function GetSingleServiceAction(serviceId) {
  try {
    const auth = await verifyAdmin();
    if (!auth.valid) return null;

    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection(COLLECTION);

    const s = await collection.findOne({ id: Number(serviceId) });
    if (!s) return null;

    return {
      id: s.id,
      name: s.name,
      type: s.type,
      refill: s.refill,
      cancelAllowed: s.cancelAllowed,
      provider: s.provider,
      price: s.price,
      min: s.min,
      max: s.max,
      status: s.status,
      createdAt: s.createdAt ? s.createdAt.toString() : null,
      updatedAt: s.updatedAt ? s.updatedAt.toString() : null,
    };
  } catch (error) {
    console.error("GetSingleServiceAction:", error);
    return null;
  }
}

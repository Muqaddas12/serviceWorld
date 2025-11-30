'use server';

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";
const DB_ADMIN = "smmadmin";
const COLLECTION = "services";

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
        service:serviceId,
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




export async function UpdateServiceStatusAction(data) {
  try {
    const auth = await verifyAdmin();
    if (!auth.valid) return { status: false, message: auth.message };

    if (!data?._id) return { status: false, message: "Missing _id" };

    const id = new ObjectId(data._id);

    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection(COLLECTION);
console.log(id)
    const result = await collection.updateOne(
      { _id: id },
      { $set: { status: data.status, updatedAt: new Date() } }
    );
console.log(result)
    return {
      status: true,
      message: result.modifiedCount > 0
        ? "Status updated successfully"
        : "Already set, no change made"
    };
  } catch (err) {
    console.error("StatusUpdate Error:", err);
    return { status: false, message: "Internal server error" };
  }
}

/* -------------------------------------------------------
   🔄 UPDATE SERVICE
-------------------------------------------------------- */
export async function UpdateAllCategoryServiceAction(data, category) {
  console.log('this is the data',data)
  console.log('this is the category',category)
  try {
    // ✅ Verify admin
    const auth = await verifyAdmin();
    if (!auth.valid) return { status: false, message: auth.message };

    if (!category) {
      return { status: false, message: "Category is required" };
    }

    // ✅ Connect DB
    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection("services");

    // ✅ Build update payload from form data
    const updatePayload = {
      name: data.name || "",
      desc: data.desc || data.description || "",
      category: data.category || category, // keep updated category or fallback to selected
      type: data.type ?? "Default",

      refill: data.refill === true || data.refill === "yes",
      cancelAllowed: data.cancelAllowed === true || data.cancelAllowed === "yes",

      rate: Number(data.rate ?? data.price ?? 0),
      min: data.min !== "" ? Number(data.min) : null,
      max: data.max !== "" ? Number(data.max) : null,

      status: data.status ?? "enabled",
      updatedAt: new Date(),
    };

    // ✅ Bulk update only docs where category matches
    const result = await collection.updateMany(
      { category },          // ✅ FIXED FILTER
      { $set: updatePayload }
    );

    if (result.matchedCount === 0) {
      return { status: false, message: `No services found in category "${category}"` };
    }

    return {
      status: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      message: `Updated ${result.modifiedCount}/${result.matchedCount} services in category "${category}" ✅`,
    };
  } catch (error) {
    console.error("UpdateAllCategoryServiceAction:", error);
    return { status: false, message: error.message || "Internal server error" };
  }
}





export async function UpdateMultipleServicesAction(data, services){
console.log('this is the data',data,'this is the services',services)
 const isEmpty = Object.keys(services).length === 0
  if(isEmpty){

     try {
    const auth = await verifyAdmin();
    if (!auth.valid) return { status: false, message: auth.message };

    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection(COLLECTION);

    const mongoId = data?._id;  // ✅ store original mongo ID

   
    const id = new ObjectId(mongoId);

    // ✅ Now check document exists correctly
    const exists = await collection.findOne({ _id: id });
    if (!exists) return { status: false, message: "Service not found" };

    // ✅ Now build update payload correctly mapping your DB fields
    const updatePayload = {
      name: data.name || "",
      desc: data.desc || data.description || "",
      category: data.category || "",
      type: data.type || "default",

      refill: data.refill === true || data.refill === "yes",
      cancelAllowed: data.cancelAllowed === true || data.cancelAllowed === "yes",

      rate: Number(data.rate ?? data.price ?? 0), // ✅ updates `rate` not `price`
      min: data.min !== "" ? Number(data.min) : null,
      max: data.max !== "" ? Number(data.max) : null,

      status: data?.status,
      updatedAt: new Date()
    };

    // ✅ Now update using `_id` instead of `id`
    const result = await collection.updateOne(
      { _id: id },
      { $set: updatePayload }
    );

    if (result.modifiedCount === 0) {
      return { status: false, message: "No changes made" };
    }

    return { status: true, message: "Service updated successfully" };

  } catch (error) {
    console.error("UpdateServiceAction:", error);
    return { status: false, message: error.message || "Internal server error" };
  }
  }else{
    try {
    const auth = await verifyAdmin();
    if (!auth.valid) return { status: false, message: auth.message };

    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection("services");

    const serviceIds = Object.keys(services)
  .map(key => key.match(/-(\d+)$/)?.[1]) // capture last number before end
  .filter(Boolean)
  .map(Number);



    console.log("Service IDs extracted:", serviceIds);
console.log(services)
    if (serviceIds.length === 0) {
      return { status: false, message: "No valid services selected" };
    }

    const updatePayload = {
      category: data.category ?? "",
      min: data.min !== "" ? Number(data.min) : null,
      max: data.max !== "" ? Number(data.max) : null,
      rate: Number(data.rate ?? 0),
      type: data.type ?? "Default",
      desc: data.desc ?? "",
      status: data.status ?? "enabled",
      updatedAt: new Date()
    };

    const result = await collection.updateMany(
      { id: { $in: serviceIds } }, // ✅ FIXED MATCH
      { $set: updatePayload }
    );

    console.log("Bulk update result:", result);

    return {
      status: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      message: `Updated ${result.modifiedCount}/${serviceIds.length} services successfully ✅`,
      updatedServices: serviceIds.join(" ")
    };

  } catch (error) {
    console.error("Bulk Update Error:", error.message);
    return { status: false, message: "Server error", error: error.message };
  }
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

    const result = await collection.deleteOne({ service: (serviceId) });

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

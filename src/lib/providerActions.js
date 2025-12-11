'use server'
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import clientPromise from "./mongodb";

const DB_ADMIN = "smmadmin";

export async function addProviderAction({ id, name, providerUrl, apiKey }) {
  try {
    // 1) Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return {
        status: false,
        message: "Invalid admin",
      };
    }

    // 2) Verify admin token
    let admin;
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
      }
      admin = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return {
        status: false,
        message: "Unauthorized admin",
      };
    }

    if (!admin) {
      return {
        status: false,
        message: "Unauthorized admin",
      };
    }

    // 3) Connect to DB
    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection("Providers");

    // Optional: check duplicate id or name
    const exists = await collection.findOne({ id });
    if (exists) {
      return { status: false, message: "Provider with this ID already exists" };
    }

    // 4) Insert provider
    const result = await collection.insertOne({
      id,
      name,
      providerUrl,
      apiKey,
      createdAt: new Date(),
    });

    if (!result?.insertedId) {
      return {
        status: false,
        message: "Something went wrong! Please try again.",
      };
    }

    // 5) Success
    return {
      status: true,
      message: "Provider added successfully",
      insertedId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error("addProviderAction error:", error);
    return {
      status: false,
      message: "Internal server error",
    };
  }
}






import axios from "axios";

export async function getProvidersAction() {
  try {
  

    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection("Providers");

    const providers = await collection.find({}).sort({ id: 1 }).toArray();

    // 🔥 Fetch balance using POST (same format as your getServices())
    const providersWithBalance = await Promise.all(
      
      providers.map(async (p) => {
        let balance = null;
        let currency = null;

        try {
          const params = new URLSearchParams();
          params.append("key", p.apiKey);
          params.append("action", "balance");

          const res = await axios.post(p.providerUrl, params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          });

          balance = res.data?.balance ?? null;
          currency = res.data?.currency ?? null;
        } 
        catch (err) {
          console.log("Balance fetch error:", err.message);
        }
    

        // Return plain serializable object
        return {
          success:true,
          id: p.id,
          name: p.name,
          selected:p.selected,
          providerUrl: p.providerUrl,
          apiKey: p.apiKey,
          balance,
          currency,
          createdAt: p.createdAt ? p.createdAt.toString() : null,
        };
      })
    );

    return providersWithBalance;
  } catch (error) {
    console.error("getProvidersAction error:", error);
    return [];
  }
}














export async function updateProviderAction({ id, name, providerUrl, apiKey }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return { status: false, message: "Invalid admin" };
    }

    let admin;
    try {
      admin = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return { status: false, message: "Unauthorized admin" };
    }

    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection("Providers");

    // Check if provider exists
    const exists = await collection.findOne({ id });

    if (!exists) {
      return {
        status: false,
        message: "Provider not found",
      };
    }

    // Update the provider
    const result = await collection.updateOne(
      { id },
      {
        $set: {
          name,
          providerUrl,
          apiKey,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return {
        status: false,
        message: "No changes made or update failed",
      };
    }

    return {
      status: true,
      message: "Provider updated successfully",
    };
  } catch (error) {
    console.error("updateProviderAction error:", error);
    return { status: false, message: "Internal server error" };
  }
}









export async function deleteProviderAction(id) {
  try {
    // 1) Verify admin token
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return { status: false, message: "Invalid admin" };
    }

    let admin;
    try {
      admin = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return { status: false, message: "Unauthorized admin" };
    }

    // 2) Connect DB
    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection("Providers");

    // 3) Check provider exists
    const exists = await collection.findOne({ id });

    if (!exists) {
      return {
        status: false,
        message: "Provider not found",
      };
    }

    // 4) Delete
    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return {
        status: false,
        message: "Failed to delete provider",
      };
    }

    // 5) Success
    return {
      status: true,
      message: "Provider deleted successfully",
    };
  } catch (error) {
    console.error("deleteProviderAction error:", error);
    return { status: false, message: "Internal server error" };
  }
}
export async function updateSelectedProviderAction({ selectedId }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return { status: false, message: "Invalid admin" };
    }

    let admin;
    try {
      admin = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return { status: false, message: "Unauthorized admin" };
    }

    const client = await clientPromise;
    const db = client.db(DB_ADMIN);
    const collection = db.collection("Providers");

    // Check if provider exists
    const exists = await collection.findOne({ id: selectedId });

    if (!exists) {
      return {
        status: false,
        message: "Provider not found",
      };
    }

    // First set all providers to unselected
    await collection.updateMany({}, { $set: { selected: false } });

    // Set only this provider as selected
    const result = await collection.updateOne(
      { id: selectedId },
      {
        $set: {
          selected: true,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return {
        status: false,
        message: "Failed to update selected provider",
      };
    }

    return {
      status: true,
      message: "Selected provider updated successfully",
    };
  } catch (error) {
    console.error("updateSelectedProviderAction error:", error);
    return { status: false, message: "Internal server error" };
  }
}

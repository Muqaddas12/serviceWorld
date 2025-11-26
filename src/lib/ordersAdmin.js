"use server";

import jwt from "jsonwebtoken";
import clientPromise from "./mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { createOrder } from "./services";



// Update URL + resend order to provider
export async function resendOrderAfterUrlUpdateAction(orderId, newUrl) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return { success: false, message: "Unauthorized — login first." };
    }

    let userData;
    try {
      userData = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return { success: false, message: "Invalid or expired token." };
    }

    const client = await clientPromise;
    const db = client.db("smmpanel");
    const ordersCollection = db.collection("orders");

    const old = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
    if (!old) {
      return { success: false, message: "Order not found." };
    }

    // Update URL in DB first
    await ordersCollection.updateOne(
      { _id: old._id },
      { $set: { link: newUrl, updatedAt: new Date().toISOString() } }
    );

    // Resend to provider API
    const orderPayload = {
      service: old.service,
      link: newUrl,
      quantity: old.quantity,
    };

    const apiRes = await createOrder(orderPayload);
    console.log("📦 Provider API Response:", apiRes);

    if (!apiRes || apiRes.error) {
      return {
        success: false,
        message: "Failed to create order on provider side.",
        providerError: apiRes?.error || "No response from API",
      };
    }

    // Update DB with API returned values
    await ordersCollection.updateOne(
      { _id: old._id },
      {
        $set: {
          providerOrderId: apiRes.order,
          startCount: apiRes.start_count ? Number(apiRes.start_count) : 0,
          remains: apiRes.remains ? Number(apiRes.remains) : 0,
          status: "pending",
          updatedAt: new Date().toISOString(),
        },
      }
    );

    // Return clean plain object
    return {
      success: true,
      message: "Order URL updated & resent successfully!",
      orderId: apiRes.order,
      updatedValues: {
        service: old.service,
        link: newUrl,
        quantity: old.quantity,
        charge: old.charge,
        status: "pending",
        startCount: apiRes.start_count ? Number(apiRes.start_count) : 0,
        remains: apiRes.remains ? Number(apiRes.remains) : 0,
        providerOrderId: apiRes.order,
        updatedAt: new Date().toISOString(),
      },
    };

  } catch (err) {
    console.error("❌ Error:", err);
    return { success: false, message: "Internal server error updating URL & resending order." };
  }
}


// ========================= Resend / Clone Order Action =========================
export async function resendOrderAction(orderId) {
  try {
    // 1️⃣ Validate user/admin token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized — please log in first." };
    }

    const userData = jwt.verify(token, process.env.JWT_SECRET);
    if (!userData?.id) {
      return { success: false, message: "Invalid or expired token." };
    }

    // 2️⃣ Connect to DB
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const ordersCollection = db.collection("orders");

    // 3️⃣ Get old order
    const old = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
    if (!old) {
      return { success: false, message: "Order not found." };
    }

    // 4️⃣ Resend to provider API
    const orderPayload = {
      service: old.service,
      link: old.link,
      quantity: old.quantity,
    };

    const response = await createOrder(orderPayload);
    console.log("📦 Provider API Response:", response);

    if (!response || response.error) {
      return { success: false, message: "Failed to resend order", providerError: response?.error };
    }

    // 5️⃣ Create new updated order doc
    const updatedOrder = {
      userId: old.userId,
      service: old.service,
      link: old.link,
      quantity: old.quantity,
      charge: old.charge,
      status: "Pending",
      startCount: response.start_count ? Number(response.start_count) : 0,
      remains: response.remains ? Number(response.remains) : 0,
      providerOrderId: response.order, // ✅ updated value
      createdAt: new Date().toISOString(),
    };

    await ordersCollection.insertOne(updatedOrder);

    // ✅ return clean plain object
    return {
      success: true,
      message: "Order resent successfully!",
      orderId: response.order,
      updatedValues: updatedOrder
    };

  } catch (err) {
    console.error("❌ Error:", err);
    return { success: false, message: "Server error resending order." };
  }
}

// ========================= Cancel Order Action =========================
export async function cancelOrderAction(orderId, reason) {
  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const ordersCollection = db.collection("orders");

    await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: "cancelled", cancelReason: reason } }
    );

    return { success: true, message: "Order cancelled successfully." };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// ========================= Mark Partial Order Action =========================
export async function markPartialAction(orderId, partialQty) {
  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const ordersCollection = db.collection("orders");

    await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: "partial", remains: Number(partialQty) } }
    );

    return { success: true, message: "Order marked as partial." };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// ========================= Update Start Count Action =========================
export async function updateStartCountAction(orderId, startCount) {
  try {
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const ordersCollection = db.collection("orders");

    await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { startCount: Number(startCount) } }
    );

    return { success: true, message: "Start count updated." };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

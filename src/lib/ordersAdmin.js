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
    const token = cookieStore.get("admin_token")?.value;
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
    const token = cookieStore.get("admin_token")?.value;

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
// ========================= Resend / Clone Multiple Orders =========================
export async function resendMultipleOrderAction(orderIds = []) {
  try {
    // 1️⃣ Validate admin token
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token)
      return { success: false, message: "Unauthorized — please log in first." };

    const userData = jwt.verify(token, process.env.JWT_SECRET);
    if (!userData?.id)
      return { success: false, message: "Invalid or expired token." };

    // 2️⃣ DB
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const ordersCollection = db.collection("orders");

    const results = [];

    // 3️⃣ Loop properly (NOT map)
    for (const id of orderIds) {
      const old = await ordersCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!old) {
        results.push({ id, success: false, message: "Order not found" });
        continue;
      }

      // 4️⃣ Provider call
      const response = await createOrder({
        service: old.service,
        link: old.link,
        quantity: old.quantity,
      });

      if (!response || response.error) {
        results.push({
          id,
          success: false,
          providerError: response?.error,
        });
        continue;
      }

      // 5️⃣ Clone order
      const newOrder = {
        userId: old.userId,
        username: old.username,
        userEmail: old.userEmail,
        name: old.name,

        service: old.service,
        link: old.link,
        quantity: old.quantity,
        charge: old.charge,
        profit: old.profit,

        status: "Pending",
        startCount: Number(response.start_count || 0),
        remains: Number(response.remains || 0),
        providerOrderId: response.order,
        createdAt: new Date(),
      };

      await ordersCollection.insertOne(newOrder);

      results.push({
        id,
        success: true,
        newOrderId: response.order,
      });
    }

    return {
      success: true,
      message: "Resend process completed",
      results,
    };

  } catch (err) {
    console.error("❌ resendMultipleOrderAction:", err);
    return { success: false, message: "Server error resending orders." };
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

export async function markPartialAction(orderId, status) {
  try {
    if (!orderId) {
      return { success: false, message: "Missing orderId." };
    }

    const client = await clientPromise;
    const db = client.db("smmpanel");
    const ordersCollection = db.collection("orders");
    const usersCollection = db.collection("users");

    // fetch order once
    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
    if (!order) {
      return { success: false, message: "Order not found." };
    }

    // === Refund flow ===
    if (String(status).toLowerCase() === "refund" || String(status).toLowerCase() === "refunded") {
      // prevent duplicate refunds
      const currentStatus = String(order.status || "").toLowerCase();
      if (currentStatus === "refund" || currentStatus === "refunded" || currentStatus === "cancelled") {
        return { success: false, message: `Order already has status "${order.status}". Refund denied.` };
      }

      // fetch user
      if (!order.userId) {
        return { success: false, message: "Order has no associated userId." };
      }

      const user = await usersCollection.findOne({ _id: new ObjectId(order.userId) });
      if (!user) {
        return { success: false, message: "User not found for this order." };
      }

      // compute refund amount (safe numeric conversion)
      const refundAmount = Number(order.charge) || 0;
      if (refundAmount <= 0) {
        // still update status but mention zero refund
        await ordersCollection.updateOne(
          { _id: order._id },
          { $set: { status: 'cancelled', updatedAt: new Date() } }
        );

        return {
          success: true,
          message: "Order status updated, but refund amount was zero.",
          refunded: 0,
        };
      }

      // increment user balance (atomic)
      const updateUser = await usersCollection.updateOne(
        { _id: user._id },
        { $inc: { balance: refundAmount } }
      );

      // mark order as refunded (and store refund metadata)
      const updateOrder = await ordersCollection.updateOne(
        { _id: order._id },
        {
          $set: {
            status: 'cancelled',
            refundedAt: new Date(),
            refundedAmount: refundAmount,
            updatedAt: new Date(),
          },
        }
      );

      console.log("Refund processed:", {
        orderId: String(order._id),
        userId: String(user._id),
        refundAmount,
        updateUserMatched: updateUser.matchedCount,
        updateUserModified: updateUser.modifiedCount,
        updateOrderMatched: updateOrder.matchedCount,
        updateOrderModified: updateOrder.modifiedCount,
      });

      return {
        success: true,
        message: "Order refunded and user balance updated.",
        refunded: refundAmount,
        orderId: String(order._id),
        userId: String(user._id),
      };
    }

    // === Generic status update ===
    const allowedStatus = String(status || "").trim();
    if (!allowedStatus) {
      return { success: false, message: "Invalid status." };
    }

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: allowedStatus, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Order not found or could not be updated." };
    }

    return { success: true, message: `Order marked as ${allowedStatus}.` };
  } catch (err) {
    console.error("markPartialAction error:", err);
    return { success: false, message: err.message || "Internal server error." };
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



export async function updateMultipleOrderStatus(orderIds = [], status) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token)
      return { status: false, message: "Unauthorized Admin" };

    const admin = jwt.verify(token, process.env.JWT_SECRET);
    if (!admin)
      return { status: false, message: "Unauthorized Admin" };

    const client = await clientPromise;
    const db = client.db("smmpanel");
    const ordersCollection = db.collection("orders");

    const result = await ordersCollection.updateMany(
      {
        _id: { $in: orderIds.map(id => new ObjectId(id)) }, // ✅ correct filter
      },
      {
        $set: { status }, // ✅ update field
      }
    );

    return {
      status: true,
      message: `${result.modifiedCount} orders updated successfully`,
    };

  } catch (error) {
    console.error("updateMultipleOrderStatus:", error);
    return { status: false, message: "Server error" };
  }
}












export async function MultipleCancelWithRefund(orderIds = []) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return { status: false, message: "Unauthorized Admin" };

    jwt.verify(token, process.env.JWT_SECRET);

    const client = await clientPromise;
    const db = client.db("smmpanel");

    const ordersCol = db.collection("orders");
    const usersCol = db.collection("users");

    // 1️⃣ Fetch orders (not already cancelled/refunded)
    const orders = await ordersCol
      .find({
        _id: { $in: orderIds.map(id => new ObjectId(id)) },
        status: { $ne: "cancelled" },
        refunded: { $ne: true },
      })
      .toArray();

    if (!orders.length)
      return { status: false, message: "No valid orders to refund" };

    // 2️⃣ Group refund amount per user
    const refundMap = {};
    for (const order of orders) {
      refundMap[order.userId] =
        (refundMap[order.userId] || 0) + Number(order.charge || 0);
    }

    // 3️⃣ Refund user balances
    for (const [userId, amount] of Object.entries(refundMap)) {
      await usersCol.updateOne(
        { _id: new ObjectId(userId) },
        { $inc: { balance: amount } } // ✅ ADD charge back
      );
    }

    // 4️⃣ Update orders status + mark refunded
    const updateResult = await ordersCol.updateMany(
      { _id: { $in: orders.map(o => o._id) } },
      {
        $set: {
          status: "cancelled",
          refunded: true,
          refundedAt: new Date(),
        },
      }
    );

    return {
      status: true,
      message: `${updateResult.modifiedCount} orders cancelled & refunded`,
    };

  } catch (error) {
    console.error("MultipleCancelWithRefund:", error);
    return { status: false, message: "Server error" };
  }
}

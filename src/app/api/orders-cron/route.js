import { NextResponse } from "next/server";
import axios from "axios";
import { getOrdersForCron, updateOrderStatusCron } from "@/lib/adminServices";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  // Simple security check
  if (key !== "AbhinaySMMPanel") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { success, orders } = await getOrdersForCron();
    console.log(orders);

    if (!success || !orders.length) {
      return NextResponse.json({ success: false, message: "No orders found" });
    }

    const results = [];

    for (const order of orders) {
      try {
        const params = new URLSearchParams();
        params.append("key", order.providerApiKey);
        params.append("action", "status");
        params.append("order", String(order.providerOrderId));

        const res = await axios.post(order.ProviderUrl, params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 10000,
        });

        const statusData = {
          orderId: order._id,
          status: res?.data?.status,
          startCount: res?.data?.start_count,
          remains: res?.data?.remains,
        };

        // ✅ Update order in DB
        await updateOrderStatusCron(statusData);

        results.push({
          orderId: order._id,
          providerOrderId: order.providerOrderId,
          ...statusData,
        });

      } catch (err) {
        results.push({
          orderId: order._id,
          providerOrderId: order.providerOrderId,
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      total: results.length,
      results,
    });

  } catch (error) {
    console.error("Cron error:", error);

    return NextResponse.json(
      { success: false, message: "Cron failed", error: error.message },
      { status: 500 }
    );
  }
}

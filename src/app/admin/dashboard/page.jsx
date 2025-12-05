"use server";

import { getAllTickets, getUnansweredTickets, getAllUsers, getAllOrdersAction } from "@/lib/adminServices";
import { getServices } from "@/lib/services";
import AdminDashboard from "./AdminDashboard";

export default async function Page() {
  try {
    // 🧠 Fetch data in parallel for speed
    const [tickets, unansweredTickets, users, services,orders] = await Promise.all([
      getAllTickets(),
      getUnansweredTickets(),
      getAllUsers(),
      getServices(),
      getAllOrdersAction()
    ]);
const newOrders = orders?.orders.map((order) =>
  JSON.parse(
    JSON.stringify({
      ...order,
      _id: order._id.toString(),
    })
  )
);

    return (
      <AdminDashboard
        totalUsers={users.count || 0}
        Tickets={tickets}
        UT={unansweredTickets}
        totalServices={services.length || 0}
        totalorders={orders.count}
        recentOrders={newOrders}
      />

    );
  } catch (error) {
    console.error("⚠️ Admin Dashboard error:", error);
    return (
      <div className="p-8 text-center text-red-400">
        Failed to load dashboard data.
      </div>
    );
  }
}

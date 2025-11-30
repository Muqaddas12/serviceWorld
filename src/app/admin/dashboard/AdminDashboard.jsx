"use client";
import Link from "next/link";

export default function AdminDashboard({ Tickets, totalUsers, UT, totalServices, totalorders ,recentOrders=[] }) {
  const stats = [
    { title: "Total Users", value: `${totalUsers}`, icon: "👥", href: "/admin/users" },
    { title: "Total Orders", value: `${totalorders || 0}`
, icon: "🧾", href: "/admin/orders" },
    { title: "Active Services", value: `${totalServices}`, icon: "⚙️", href: "/admin/services" },
    { title: "Pending Tickets", value: `${UT?.count || 0}`, icon: "💬", href: "/admin/tickets" },
  ];

 
  const recentTickets = Tickets?.tickets?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0F1117] text-gray-800 dark:text-gray-200 p-6 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of your SMM panel analytics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="
              bg-white dark:bg-[#1A1F2B]
              border border-gray-300 dark:border-gray-700
              rounded-2xl p-5 flex flex-col items-center text-center
              shadow-sm hover:shadow-md transition
            "
          >
            <Link href={stat.href} className="text-4xl mb-2 hover:scale-110 transition cursor-pointer">
              {stat.icon}
            </Link>

            <h3 className="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-1">
              {stat.title}
            </h3>

            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
 {/* Recent Orders */}
<div className="bg-white dark:bg-[#1A1F2B] border border-gray-300 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Recent Orders</h2>
    <Link
      href="/admin/orders"
      className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition"
    >
      View All
    </Link>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full text-sm min-w-[700px]">
      <thead>
        <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
          <th className="py-2 px-3 text-left">Order ID</th>
          <th className="py-2 px-3 text-left">Service</th>
          <th className="py-2 px-3 text-left">Amount</th>
          <th className="py-2 px-3 text-left">Status</th>
          <th className="py-2 px-3 text-left">Date</th>
        </tr>
      </thead>

      <tbody>
        {recentOrders.slice(0, 5).map((order, i) => (
          <tr
            key={i}
            className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <td className="py-2 px-3 font-semibold">{order.providerOrderId}</td>

            <td className="py-2 px-3 truncate max-w-[200px]">{order.service}</td>

            <td className="py-2 px-3 font-semibold text-gray-800 dark:text-gray-200">
              ₹{order.charge}
            </td>

            <td className="py-2 px-3">
              <span
                className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  order.status === "Completed"
                    ? "bg-green-200 text-green-700 dark:bg-green-700/20 dark:text-green-400"
                    : order.status === "Pending"
                    ? "bg-yellow-200 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-400"
                    : order.status === "Processing"
                    ? "bg-blue-200 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300"
                    : order.status === "Partial"
                    ? "bg-purple-200 text-purple-700 dark:bg-purple-700/20 dark:text-purple-300"
                    : "bg-red-200 text-red-700 dark:bg-red-700/20 dark:text-red-400"
                }`}
              >
                {order.status}
              </span>
            </td>

            <td className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400">
              {new Date(order.createdAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      {/* Recent Tickets */}
      <div className="bg-white dark:bg-[#1A1F2B] border border-gray-300 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Recent Tickets</h2>
          <Link
            href="/admin/tickets"
            className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                <th className="py-2 px-3 text-left">User</th>
                <th className="py-2 px-3 text-left">Subject</th>
                <th className="py-2 px-3 text-left">Message</th>
                <th className="py-2 px-3 text-left">Status</th>
                <th className="py-2 px-3 text-left">Created</th>
              </tr>
            </thead>

            <tbody>
              {recentTickets.length > 0 ? (
                recentTickets.map((ticket, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <td className="py-2 px-3 font-semibold">{ticket.username}</td>
                    <td className="py-2 px-3">{ticket.subject}</td>
                    <td className="py-2 px-3 truncate max-w-[200px]">{ticket.message}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-semibold 
                        ${
                          ticket.status === "answered"
                            ? "bg-green-200 text-green-700 dark:bg-green-700/20 dark:text-green-400"
                            : ticket.status === "pending" || ticket.status === "open"
                            ? "bg-yellow-200 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-400"
                            : "bg-red-200 text-red-700 dark:bg-red-700/20 dark:text-red-400"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(ticket.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No recent tickets found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}

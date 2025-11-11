"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OrdersPage() {
  const orders = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    userId: `user_${1000 + (i % 10)}`, // 10 users repeating
    service: `Instagram Likes Package #${i + 1}`,
    link: `https://instagram.com/post/${i + 1}`,
    quantity: Math.floor(Math.random() * 1000) + 100,
    charge: (Math.random() * 10).toFixed(5),
    startCount: (3000 + Math.floor(Math.random() * 1000)).toString(),
    remains: (Math.random() * 200).toFixed(0),
    currency: "USD",
    status: ["Confirm", "Partial", "Pending", "Cancelled"][
      Math.floor(Math.random() * 4)
    ],
    providerOrderId: `prov_${Math.floor(Math.random() * 999999)}`,
    createdAt: new Date(Date.now() - i * 3600000).toLocaleString(),
  }));

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirm":
        return "text-green-400 bg-green-900/20";
      case "partial":
        return "text-yellow-400 bg-yellow-900/20";
      case "pending":
        return "text-blue-400 bg-blue-900/20";
      case "cancelled":
        return "text-red-400 bg-red-900/20";
      default:
        return "text-gray-400 bg-gray-800/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6">
      <h1 className="text-2xl font-semibold mb-6 text-yellow-400">
        Orders Overview
      </h1>

      <div className="overflow-x-auto rounded-xl border border-yellow-500/20 shadow-lg">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-[#1a1a1a] text-yellow-400 uppercase">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Link</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Charge</th>
              <th className="p-3 text-left">Start Count</th>
              <th className="p-3 text-left">Remains</th>
              <th className="p-3 text-left">Currency</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Provider ID</th>
              <th className="p-3 text-left">Created</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, i) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-yellow-500/10 hover:bg-[#1c1c1c]/70"
              >
                <td className="p-3 text-gray-400">{order.id}</td>
                <td className="p-3">
                  {/* 👇 Clickable userId */}
                  <Link
                    href={`/users/view/${order.userId}`}
                    className="text-yellow-400 hover:text-yellow-300 underline"
                  >
                    {order.userId}
                  </Link>
                </td>
                <td className="p-3 font-medium text-white">
                  {order.service}
                </td>
                <td className="p-3 text-blue-400 underline truncate max-w-[150px]">
                  <a href={order.link} target="_blank" rel="noreferrer">
                    {order.link}
                  </a>
                </td>
                <td className="p-3">{order.quantity}</td>
                <td className="p-3">${order.charge}</td>
                <td className="p-3">{order.startCount}</td>
                <td className="p-3">{order.remains}</td>
                <td className="p-3">{order.currency}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3">{order.providerOrderId}</td>
                <td className="p-3 text-gray-400">{order.createdAt}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

import EditUrlModal from "./EditUrlModal";
import EditStartCountModal from "./EditStartCountModal";
import MarkPartialModal from "./MarkPartialModal";
import ResendOrderModal from "./ResendOrderModal";
import CancelReasonModal from "./CancelOrderModal";

export default function OrdersPage({ orders = [] }) {
  const [popup, setPopup] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openPopup = (type, order) => {
    setPopup(type);
    setSelectedOrder(order);
  };

  const closePopup = () => {
    setPopup(null);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
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

  // 🚫 If no orders → show message
  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">
        No orders found.
      </div>
    );
  }

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
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Provider ID</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, i) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-yellow-500/10 hover:bg-[#1c1c1c]/70"
              >
                <td className="p-3">{i + 1}</td>

                <td className="p-3">
                  <Link
                    href={`/users/view/${order.userId}`}
                    className="text-yellow-400 hover:text-yellow-300 underline"
                  >
                    {order.userId}
                  </Link>
                </td>

                <td className="p-3 font-medium text-white">{order.service}</td>

                <td className="p-3 text-blue-400 underline truncate max-w-[150px]">
                  <a href={order.link} target="_blank">
                    {order.link}
                  </a>
                </td>

                <td className="p-3">{order.quantity}</td>
                <td className="p-3">${order.charge}</td>
                <td className="p-3">{order.startCount}</td>
                <td className="p-3">{order.remains}</td>

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

                <td className="p-3 relative">
                  <details className="group">
                    <summary className="cursor-pointer bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded hover:bg-yellow-600/30">
                      Options
                    </summary>

                    <div className="absolute mt-2 bg-[#1b1b1b] border border-yellow-500/20 rounded p-2 w-44 z-50">
                      <button
                        onClick={() => openPopup("editUrl", order)}
                        className="block w-full text-left px-2 py-1 hover:bg-yellow-600/20"
                      >
                        Edit URL
                      </button>

                      <button
                        onClick={() => openPopup("editStart", order)}
                        className="block w-full text-left px-2 py-1 hover:bg-yellow-600/20"
                      >
                        Edit Start Count
                      </button>

                      <button
                        onClick={() => openPopup("partial", order)}
                        className="block w-full text-left px-2 py-1 hover:bg-yellow-600/20"
                      >
                        Mark Partial
                      </button>

                      <button
                        onClick={() => openPopup("resend", order)}
                        className="block w-full text-left px-2 py-1 hover:bg-yellow-600/20"
                      >
                        Resend Order
                      </button>

                      <button
                        onClick={() => openPopup("cancelReason", order)}
                        className="block w-full text-left px-2 py-1 hover:bg-yellow-600/20"
                      >
                        Reason of Cancel
                      </button>
                    </div>
                  </details>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUPS */}
      {popup === "editUrl" && <EditUrlModal order={selectedOrder} close={closePopup} />}
      {popup === "editStart" && <EditStartCountModal order={selectedOrder} close={closePopup} />}
      {popup === "partial" && <MarkPartialModal order={selectedOrder} close={closePopup} />}
      {popup === "resend" && <ResendOrderModal order={selectedOrder} close={closePopup} />}
      {popup === "cancelReason" && <CancelReasonModal order={selectedOrder} close={closePopup} />}
    </div>
  );
}

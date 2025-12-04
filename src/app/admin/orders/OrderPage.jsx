"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

import EditUrlModal from "./EditUrlModal";
import EditStartCountModal from "./EditStartCountModal";
import MarkPartialModal from "./MarkPartialModal";
import ResendOrderModal from "./ResendOrderModal";
import CancelReasonModal from "./CancelOrderModal";

export default function OrdersPage({ sorders = [] }) {

  const [popup, setPopup] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const result = JSON.parse(sorders || "[]");
    setOrders(result);
  }, [sorders]);

  const openPopup = (type, order) => {
    setPopup(type);
    setSelectedOrder(order);
    setOpenMenuIndex(null);
  };

  const closePopup = () => {
    setPopup(null);
    setSelectedOrder(null);
  };

  // CLICK OUTSIDE TO CLOSE MENU
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case "confirm":
        return "text-green-600 bg-green-200 dark:bg-green-900/40 dark:text-green-300";
      case "partial":
        return "text-yellow-600 bg-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "pending":
        return "text-blue-600 bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300";
      case "cancelled":
        return "text-red-600 bg-red-200 dark:bg-red-900/40 dark:text-red-300";
      default:
        return "text-gray-600 bg-gray-200 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getFilteredOptions = (status) => {
    const options = [
      ["editUrl", "Edit URL"],
      ["editStart", "Edit Start Count"],
      ["partial", "Mark Partial"],
      ["resend", "Resend Order"],
      ["cancelReason", "Reason of Cancel"],
    ];

    status = String(status).toLowerCase();

    if (status === "completed") return [];
    if (status === "cancelled") return options;

    return options.filter(([type]) => type !== "cancelReason");
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300 text-xl">
        No orders found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0d0d0d] text-black dark:text-white p-4">

      <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        Orders Overview
      </h1>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm">
        <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
            <tr>
              {[
                "#", "Username",'email', "Service", "Link", "Qty", "Charge",
                "Start Count", "Remains", "Status", "Provider ID", "Actions"
              ].map((h) => (
                <th key={h} className="p-3 text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {orders.map((order, i) => {
              const options = getFilteredOptions(order.status);

              return (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td className="p-3">{i + 1}</td>

                  <td className="p-3">
                    <span
                     
                      className="text-gray-700 dark:text-gray-700 "
                    >
                      {order.username||'no username'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                     
                      className="text-gray-700 dark:text-gray-700 "
                    >
                      {order.userEmail||'no email'}
                    </span>
                  </td>

                  <td className="p-3 font-medium">{order.service}</td>

                  <td className="p-3 text-blue-600 dark:text-blue-400 underline truncate max-w-[150px]">
                    <a href={order.link} target="_blank">{order.link}</a>
                  </td>

                  <td className="p-3">{order.quantity}</td>
                  <td className="p-3">${order.charge}</td>
                  <td className="p-3">{order.startCount}</td>
                  <td className="p-3">{order.remains}</td>

                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3">{order.providerOrderId}</td>

                  <td className="p-3 relative" ref={menuRef}>
                    {options.length > 0 && (
                      <>
                        <button
                          className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 px-2 py-1 rounded"
                          onClick={() =>
                            setOpenMenuIndex(openMenuIndex === i ? null : i)
                          }
                        >
                          Options
                        </button>

                        <AnimatePresence>
                          {openMenuIndex === i && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute mt-2 bg-white dark:bg-[#1b1b1b] border border-gray-300 dark:border-gray-700 
                                  rounded-xl p-2 w-48 z-50 shadow-xl"
                            >
                              {options.map(([type, label]) => (
                                <button
                                  key={type}
                                  onClick={() => openPopup(type, order)}
                                  className="block w-full text-left px-3 py-2 rounded-lg 
                                  hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                >
                                  {label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">
        {orders.map((order, i) => {
          const options = getFilteredOptions(order.status);

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-300 dark:border-gray-800"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  #{i + 1} – {order.service}
                </span>

                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="text-sm space-y-1">
                <p><b>User:</b> {order.userId}</p>
                <p className="truncate"><b>Link:</b> <a className="underline text-blue-500" href={order.link}>{order.link}</a></p>
                <p><b>Qty:</b> {order.quantity}</p>
                <p><b>Charge:</b> ${order.charge}</p>
                <p><b>Start:</b> {order.startCount}</p>
                <p><b>Remains:</b> {order.remains}</p>
                <p><b>Provider:</b> {order.providerOrderId}</p>
              </div>

              {options.length > 0 && (
                <div className="mt-3" ref={menuRef}>
                  <button
                    className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 px-3 py-2 rounded"
                    onClick={() =>
                      setOpenMenuIndex(openMenuIndex === i ? null : i)
                    }
                  >
                    Options
                  </button>

                  <AnimatePresence>
                    {openMenuIndex === i && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                        rounded-xl p-2 shadow"
                      >
                        {options.map(([type, label]) => (
                          <button
                            key={type}
                            onClick={() => openPopup(type, order)}
                            className="block w-full text-left px-3 py-2 rounded-lg 
                            hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          >
                            {label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          );
        })}
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

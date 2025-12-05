"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import EditUrlModal from "./EditUrlModal";
import EditStartCountModal from "./EditStartCountModal";
import MarkPartialModal from "./MarkPartialModal";
import ResendOrderModal from "./ResendOrderModal";
import CancelReasonModal from "./CancelOrderModal";
import Dropdown from "./CategoryDropDown";

export default function OrdersPage({ sorders = "[]" }) {
  const [popup, setPopup] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [options, setOptions] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // parse orders
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      try {
        const parsed = Array.isArray(sorders) ? sorders : JSON.parse(sorders || "[]");
        setOrders(parsed);
        setFilteredOrders(parsed);
      } catch {
        setOrders([]);
        setFilteredOrders([]);
      }
      setLoading(false);
    }, 500); // smooth loading
  }, [sorders]);

  const normalize = (s) => String(s ?? "").trim().toLowerCase();

  // Dropdown filter counts
  useEffect(() => {
    if (!orders?.length) {
      setOptions([{ label: `All Orders (0)`, value: "all" }]);
      return;
    }

    const countBy = (status) =>
      orders.filter((o) => normalize(o.status) === normalize(status)).length;

    setOptions([
      { label: `All Orders (${orders.length})`, value: "all" },
      { label: `Pending (${countBy("pending")})`, value: "pending" },
      { label: `Processing (${countBy("processing")})`, value: "processing" },
      { label: `Inprogress (${countBy("inprogress")})`, value: "inprogress" },
      { label: `Completed (${countBy("completed")})`, value: "completed" },
      { label: `Partial (${countBy("partial")})`, value: "partial" },
      {
        label: `Canceled (${countBy("canceled") + countBy("cancelled")})`,
        value: "canceled",
      },
      { label: `Fail (${countBy("fail")})`, value: "fail" },
    ]);
  }, [orders]);

  // status filtering
  const handleSelect = (item) => {
    const val = item?.value;
    if (!val || val === "all") {
      setFilteredOrders(orders);
      return;
    }

    if (val === "canceled") {
      setFilteredOrders(
        orders.filter((o) => ["canceled", "cancelled"].includes(normalize(o.status)))
      );
      return;
    }

    setFilteredOrders(orders.filter((o) => normalize(o.status) === normalize(val)));
  };

  // search filter
  const finalResults = useMemo(() => {
    if (!search.trim()) return filteredOrders;

    const q = search.toLowerCase();
    return filteredOrders.filter((o) =>
      [o.username, o.userEmail, o.service, o.providerOrderId, o.link]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [filteredOrders, search]);

  // status colors
  const getStatusColor = (status) => {
    switch (normalize(status)) {
      case "confirmed":
      case "confirm":
        return "text-green-600 bg-green-200 dark:bg-green-900/40 dark:text-green-300";
      case "partial":
        return "text-yellow-600 bg-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "pending":
        return "text-blue-600 bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300";
      case "canceled":
      case "cancelled":
      case "cancel":
        return "text-red-600 bg-red-200 dark:bg-red-900/40 dark:text-red-300";
      default:
        return "text-gray-600 bg-gray-200 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // actions
  const getFilteredOptions = (status) => {
    const base = [
      ["editUrl", "Edit URL"],
      ["editStart", "Edit Start Count"],
      ["partial", "Update Status"],
      ["resend", "Resend Order"],
      ["cancelReason", "Reason of Cancel"],
    ];

    const s = normalize(status);
    if (s === "completed") return [];
    if (s === "canceled" || s === "cancelled") return base;
    return base.filter(([t]) => t !== "cancelReason");
  };

  // popups
  const openPopup = (type, order) => {
    setPopup(type);
    setSelectedOrder(order);
    setOpenMenuIndex(null);
  };
  const closePopup = () => {
    setPopup(null);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 dark:bg-[#0d0d0d] text-black dark:text-white">

      <h1 className="text-2xl font-semibold mb-6">Orders Overview</h1>

      {/* Search + Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">

        <input
          type="text"
          placeholder="Search by username, email, service, provider ID..."
          className="w-full md:w-1/2 px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Dropdown label="All Orders" options={options} onSelect={handleSelect} />
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-300 dark:bg-gray-800 rounded-lg" />
          ))}
        </div>
      )}

      {!loading && (
        <>
          {/* DESKTOP VIEW */}
          <div className="hidden md:block rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  {[
                    "#", "Username", "Email", "Service", "Link", "Qty", "Charge",
                    "Start", "Remains", "Status", "Provider", "Actions",
                  ].map((h) => (
                    <th key={h} className="p-3 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {finalResults.map((order, i) => {
                  const rowOptions = getFilteredOptions(order.status);
                  return (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">{order.username || "No username"}</td>
                      <td className="p-3">{order.userEmail || "No email"}</td>
                      <td className="p-3">{order.service}</td>

                      <td className="p-3">
                        <a className="text-blue-500 underline" href={order.link} target="_blank">
                          {order.link}
                        </a>
                      </td>

                      <td className="p-3">{order.quantity}</td>
                      <td className="p-3">${order.charge}</td>
                      <td className="p-3">{order.startCount}</td>
                      <td className="p-3">{order.remains}</td>

                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>

                      <td className="p-3">{order.providerOrderId}</td>

                      <td className="p-3 relative">
                        {rowOptions.length > 0 && (
                          <>
                            <button
                              className="px-2 py-1 rounded bg-gray-300 dark:bg-gray-700"
                              onClick={() => setOpenMenuIndex(openMenuIndex === i ? null : i)}
                            >
                              Options
                            </button>

                            <AnimatePresence>
                              {openMenuIndex === i && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="absolute mt-2 right-0 w-44 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-2 z-50 border dark:border-gray-700"
                                >
                                  {rowOptions.map(([type, label]) => (
                                    <button
                                      key={type}
                                      onClick={() => openPopup(type, order)}
                                      className="block w-full px-3 py-2 text-left rounded hover:bg-gray-200 dark:hover:bg-gray-700"
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
          <div className="md:hidden space-y-4 mt-3">
            {finalResults.map((order, i) => {
              const rowOptions = getFilteredOptions(order.status);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800"
                >
                  <div className="flex justify-between">
                    <b>#{i + 1}</b>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <p><b>User:</b> {order.username}</p>
                  <p><b>Email:</b> {order.userEmail}</p>
                  <p><b>Service:</b> {order.service}</p>
                  <p><b>Qty:</b> {order.quantity}</p>
                  <p><b>Charge:</b> {order.charge}</p>

                  <p className="truncate">
                    <b>Link:</b>{" "}
                    <a className="underline text-blue-500" href={order.link} target="_blank">
                      {order.link}
                    </a>
                  </p>

                  {rowOptions.length > 0 && (
                    <div className="mt-3">
                      <button
                        className="px-3 py-2 rounded bg-gray-300 dark:bg-gray-700"
                        onClick={() => setOpenMenuIndex(openMenuIndex === i ? null : i)}
                      >
                        Options
                      </button>

                      <AnimatePresence>
                        {openMenuIndex === i && (
                          <motion.div className="mt-2 bg-white dark:bg-gray-900 border rounded-lg p-2">
                            {rowOptions.map(([type, label]) => (
                              <button
                                key={type}
                                onClick={() => openPopup(type, order)}
                                className="block w-full px-3 py-2 text-left rounded hover:bg-gray-200 dark:hover:bg-gray-700"
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
        </>
      )}

      {/* Popups */}
      {popup === "editUrl" && <EditUrlModal order={selectedOrder} close={closePopup} />}
      {popup === "editStart" && <EditStartCountModal order={selectedOrder} close={closePopup} />}
      {popup === "partial" && <MarkPartialModal order={selectedOrder} close={closePopup} />}
      {popup === "resend" && <ResendOrderModal order={selectedOrder} close={closePopup} />}
      {popup === "cancelReason" && <CancelReasonModal order={selectedOrder} close={closePopup} />}
    </div>
  );
}

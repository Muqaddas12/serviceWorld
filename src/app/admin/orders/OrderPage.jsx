"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import EditUrlModal from "./EditUrlModal";
import EditStartCountModal from "./EditStartCountModal";
import MarkPartialModal from "./MarkPartialModal";
import ResendOrderModal from "./ResendOrderModal";
import CancelReasonModal from "./CancelOrderModal";
import Dropdown from "./CategoryDropDown";
import MultipleHandleBox from "./MultipleHandleBox";

export default function OrdersPage({ sorders = "[]" }) {
  const [popup, setPopup] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [options, setOptions] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
const [selectedRows, setSelectedRows] = useState([]);

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
    }, 500);
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

  // Dropdown filter logic
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

  // Search across ALL visible fields
  const finalResults = useMemo(() => {
    if (!search.trim()) return filteredOrders;
    const q = search.toLowerCase();

    return filteredOrders.filter((o) =>
      Object.values({
        index: "",
        id: o.providerOrderId,
        username: o.username,
        charge: o.charge,
        profit: o.profit,
        link: o.link,
        seller: o.ProviderUrl,
        service: o.service,
        qty: o.quantity,
        start: o.startCount,
        remains: o.remains,
        status: o.status,
      })
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [filteredOrders, search]);

  // status color
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
useEffect(() => {
  setSelectedRows((prev) =>
    prev.filter((id) =>
      finalResults.some((o) => o._id.toString() === id)
    )
  );
}, [finalResults]);
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
    return base.filter(([t]) => t !== "cancelReason"&&t!=='resend');
  };

  const openPopup = (type, order) => {
    setPopup(type);
    setSelectedOrder(order);
    setOpenMenuIndex(null);
  };
  const closePopup = () => {
    setPopup(null);
    setSelectedOrder(null);
  };
const selectAllRows = (checked) => {
  if (checked) {
    setSelectedRows(finalResults.map(o => o._id.toString()));
  } else {
    setSelectedRows([]);
  }
};

const toggleRow = (id) => {
  const sid = id.toString();
  setSelectedRows((prev) =>
    prev.includes(sid)
      ? prev.filter((x) => x !== sid)
      : [...prev, sid]
  );
};


const allSelected =
  finalResults.length > 0 &&
  finalResults.every(o =>
    selectedRows.includes(o._id.toString())
  );


  return (
    <div className="min-h-screen p-4 bg-gray-100 dark:bg-[#0d0d0d] text-black dark:text-white">

      <h1 className="text-2xl font-semibold mb-6">Orders Overview</h1>

      {/* Search + Dropdown */}
      <div className=" mb-4 w-full">
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full  px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

        <Dropdown label="All Orders" options={options} onSelect={handleSelect} />

        <MultipleHandleBox selectedRows={selectedRows}/>
      {/* Loading */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-300 dark:bg-gray-800 rounded-lg" />
          ))}
        </div>
      )}

      {/* TABLE */}
      {!loading && (
        <div className="overflow-x-auto rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm">
          <table className="min-w-max w-full text-sm">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-3 py-2 text-left">
  <input
  type="checkbox"
  checked={allSelected}
  onChange={(e) => selectAllRows(e.target.checked)}
  className="w-4 h-4 accent-blue-600 cursor-pointer"
/>
</th>

                {[
                  "PID",
                  "ID",
                  'Date',
                  "Username",
                  "Charge",
                  "Profit",
                  "Name",
                  "Link",
                  "Seller",
                  
                  "Qty",
                  "Start",
                  "Remains",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="p-3 whitespace-nowrap text-left">
                    {h}
                  </th>
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
                    <td className="p-3">
<input
  type="checkbox"
  checked={selectedRows.includes(order._id.toString())}
  onChange={() => toggleRow(order._id)}
  className="w-4 h-4 accent-blue-600 cursor-pointer"
/>

</td>

                    <td className="p-3">{order?.orderNumber}</td>

                    <td className="p-3">
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium">{order.service}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {order.providerOrderId}
                        </span>
                      </div>
                    </td>
<td className="p-3 leading-tight">
  {order?.createdAt && (
    <>
      <div>{new Date(order.createdAt).toLocaleDateString()}</div>
      <div>{new Date(order.createdAt).toLocaleTimeString()}</div>
    </>
  )}
</td>


                    <td className="p-3">{order.username || "No username"}</td>
                    <td className="p-3">₹{order.charge}</td>
                    <td className="p-3">₹{order?.profit || "0"}</td>
                    <td className="p-3">₹{order?.profit || "0"}</td>

                  

               <td className="p-3">
  <a
    href={order.link}
    target="_blank"
    title={order.link}
    className="block max-w-[200px] truncate text-blue-500 underline"
  >
    {order.link}
  </a>
</td>


                    <td className="p-3">{order.ProviderUrl}</td>
              

                    <td className="p-3">{order.quantity}</td>
                    <td className="p-3">{order.startCount}</td>
                    <td className="p-3">{order.remains}</td>

                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

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

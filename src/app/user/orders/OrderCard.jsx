"use client";

import {
  FaClipboardList,
  FaCalendarAlt,
  FaLayerGroup,
  FaLink,
  FaRupeeSign,
  FaBolt,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";
import { MoreVertical } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useState, useRef, useEffect } from "react";

import { CancelUserOrder, MultipleCancelWithRefund } from "@/lib/ordersAdmin";

/* ▸ Status Styles */
const STATUS_STYLES = {
  Pending: "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
  Completed: "bg-green-500/20 text-green-500",
  Processing: "bg-gray-400/30 dark:bg-gray-600/40 text-gray-600 dark:text-gray-300",
  Canceled: "bg-red-500/20 text-red-400",
  cancelled: "bg-red-500/20 text-red-400",
  Partial: "bg-yellow-500/20 text-yellow-500",
  Inprogress: "bg-purple-500/20 text-purple-400",
};

const STATUS_ICONS = {
  Pending: <FaClock className="mr-1" />,
  Completed: <FaCheckCircle className="mr-1" />,
  Processing: <FaSpinner className="animate-spin mr-1" />,
  Canceled: <FaTimesCircle className="mr-1" />,
  Cancelled:<FaTimesCircle className="mr-1" />,
  Partial: <FaBolt className="mr-1" />,
  Inprogress: <FaLayerGroup className="mr-1" />,
};

export default function OrderCard({ order }) {
  const { symbol, convert } = useCurrency();

  const [openMenu, setOpenMenu] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const menuRef = useRef(null);

  const formattedCharge = convert(Number(order?.charge || 0)).toFixed(2);
const isCompleted = ["completed", "cancelled"].includes(
  order.status.toLowerCase()
);


  /* Close menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* 🔴 Cancel API */
  const handleCancel = async () => {
    try {
      setLoading(true);
      const res = await CancelUserOrder([order._id]);

      if (!res.status) {
        alert(res.message)
      } else {
        alert("Order cancelled");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-[#1A1F2B] p-5 rounded-2xl border border-gray-300 dark:border-[#2B3143] shadow-md hover:shadow-xl transition-all">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <FaClipboardList /> Order #{order?.orderNumber|| ''}
          </h3>

          <span className={`px-3 py-1 rounded-full text-xs flex items-center ${STATUS_STYLES[order.status]}`}>
            {STATUS_ICONS[order.status]}
            {order.status}
          </span>
        </div>

        {/* BODY */}
        <div className="space-y-2 text-sm">

          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            {new Date(order.createdAt).toLocaleString()}
          </div>

          <div className="flex items-center gap-2">
            <FaLayerGroup /> {order.service}
          </div>

          <div className="flex items-center gap-2">
            <FaLink />
            <a href={order.link} target="_blank" className="truncate hover:underline">
              {order.link}
            </a>
          </div>

          <div className="flex justify-between">
            <span>Qty: {order.quantity}</span>
            <span className="flex items-center gap-1 text-green-600">
              <FaRupeeSign /> {symbol}{formattedCharge}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>
              Start: {order.startCount ?? 0} | Remains: {order.remains ?? 0}
            </span>

            {/* MENU */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <MoreVertical size={18} />
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#1f2433] border rounded-lg shadow-lg z-50">

                  <button
                    disabled={isCompleted}
                    onClick={() => {
                      setOpenMenu(false);
                      setConfirmOpen(true);
                    }}
                    className={`w-full px-4 py-2 text-left
                      ${isCompleted
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                    `}
                  >
                    ❌ Cancel 
                  </button>

                  {/* <button
                    onClick={() => {
                      setOpenMenu(false);
                      toast("Resend triggered");
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    🔁 Refill
                  </button> */}

                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1f2433] p-6 rounded-xl w-96">
            <h3 className="font-semibold mb-3">Confirm Cancellation</h3>
            <p className="text-sm mb-5">
              Are you sure you want to cancel this order?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
              >
                No
              </button>

              <button
                disabled={loading}
                onClick={handleCancel}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                {loading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

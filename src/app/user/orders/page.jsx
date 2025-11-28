"use client";

import { useState, useEffect } from "react";
import OrderGrid from "./OrderGrid";
import OrderFilter from "./OrderFilter";
import { FaSpinner, FaClipboardList } from "react-icons/fa";
import { getUserOrders } from "@/lib/userActions";
import { deleteAllOrders } from "@/lib/userActions";

export default function OrdersPage() {
 
  const [orders, setOrders] = useState([]);
  const [displayOrders, setDisplayOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("All");

  const [renderCount, setRenderCount] = useState(12); // Default: show 12
  const [loadingMore, setLoadingMore] = useState(false);

  // -------------------------------------------
  // Fetch orders
  // -------------------------------------------
  useEffect(() => {
    async function loadOrders() {
      const res = await getUserOrders();

      if (res?.success) {
        setOrders(res.orders);
        setDisplayOrders(res.orders);
      }

      setLoading(false);
    }

    loadOrders();
  }, []);

  // -------------------------------------------
  // Filtering Logic
  // -------------------------------------------
  useEffect(() => {
    let filtered = [...orders];

    // ➤ Status Filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // ➤ Search Filter
    if (search.trim() !== "") {
      filtered = filtered.filter((o) =>
        (o.service || "").toLowerCase().includes(search.toLowerCase()) ||
        (o.providerOrderId || "").includes(search) ||
        (o.link || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    // ➤ Date Filter
    if (dateRange !== "All") {
      const now = new Date();
      filtered = filtered.filter((o) => {
        const created = new Date(o.createdAt);
        const diff = (now - created) / (1000 * 60 * 60 * 24); // days difference

        if (dateRange === "Today") return diff <= 1;
        if (dateRange === "7days") return diff <= 7;
        if (dateRange === "30days") return diff <= 30;
        return true;
      });
    }

    setDisplayOrders(filtered);
    setRenderCount(12); // Reset pagination
  }, [statusFilter, search, dateRange, orders]);

  // -------------------------------------------
  // Handle Load More
  // -------------------------------------------
  const handleLoadMore = () => {
    setLoadingMore(true);

    setTimeout(() => {
      setRenderCount((prev) => prev + 12); // Load next 12
      setLoadingMore(false);
    }, 500);
  };

  // -------------------------------------------
  // Loading Skeleton
  // -------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex flex-col gap-6">
        <div className="h-10 w-48 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------
  // Actual UI
  // -------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0F1117] text-gray-800 dark:text-gray-200 p-4 md:p-6">

      {/* ░ FILTERS + SEARCH + DATE RANGE ░ */}
      <OrderFilter
        statusFilter={statusFilter}
        handleStatusFilter={(v) => setStatusFilter(v)}
        search={search}
        setSearch={setSearch}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {/* ░ EMPTY STATE ░ */}
      {displayOrders.length === 0 ? (
        <div className="text-center py-10 flex flex-col items-center">
          <FaClipboardList className="text-3xl mb-3 text-gray-500 dark:text-gray-500" />
          <p className="text-gray-600 dark:text-gray-400">
            No orders found.
          </p>
        </div>
      ) : (
        <>
          <OrderGrid orders={displayOrders.slice(0, renderCount)} />

          {/* ░ LOAD MORE BUTTON ░ */}
          {renderCount < displayOrders.length && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="
                  px-6 py-2 rounded-lg bg-gray-800 dark:bg-gray-700 
                  hover:bg-gray-700 dark:hover:bg-gray-600
                  text-white font-semibold transition
                "
              >
                {loadingMore ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

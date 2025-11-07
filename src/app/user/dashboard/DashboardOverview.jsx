"use client";

import { useEffect, useState } from "react";
import {
  MdAddShoppingCart,
  MdAccountBalanceWallet,
  MdTrendingUp,
  MdSupportAgent,
} from "react-icons/md";

import { FaUserCircle,FaTools } from "react-icons/fa";
import Announcements from "./Announcements";
import LatestOrders from "./LatestOrders";
import OrderForm from "./OrderForm";
import SupportSection from "./SupportSection";
import CategoryFilter from "./CategoryFilter";
const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-[#151517] border border-yellow-500/20 rounded-2xl shadow-md p-3 sm:p-4 lg:p-5 hover:border-yellow-500/40 transition-all cursor-pointer ${className}`}
  >
    {children}
  </div>
);



export default function DashboardLayout({ user, serviceEnabled }) {
  console.log(serviceEnabled)
  const [spent, setSpent] = useState(0);
  const [orders, setOrders] = useState(0);

  useEffect(() => {
    setSpent(1245.75);
    setOrders(689);
  }, []);

  const quickActions = [
    { icon: <MdAddShoppingCart size={22} />, label: "New Order", href: "/user/dashboard" },
    { icon: <MdAccountBalanceWallet size={22} />, label: "Add Funds", href: "/user/addfunds" },
  ];

  return (
    <div className="w-full min-h-screen text-gray-100 py-4 sm:py-6 flex justify-center">
      <div className="w-full max-w-6xl px-3 sm:px-6 space-y-8">
        
        {/* ================= STATS ================= */}
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-full bg-yellow-500/20 text-yellow-400">
                <FaUserCircle size={22} />
              </div>
              <div>
                <p className="text-[11px] sm:text-sm text-gray-400">Username</p>
                <h4 className="text-sm sm:text-lg font-semibold text-yellow-300 truncate">
                  {user?.username || "Guest"}
                </h4>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-full bg-yellow-500/20 text-yellow-400">
                <MdAccountBalanceWallet size={22} />
              </div>
              <div>
                <p className="text-[11px] sm:text-sm text-gray-400">Balance</p>
                <h4 className="text-sm sm:text-lg font-semibold text-yellow-300">
                ₹{user?.balance ? Number(user.balance).toFixed(2) : "0.00"}

                </h4>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-full bg-yellow-500/20 text-yellow-400">
                <MdTrendingUp size={22} />
              </div>
              <div>
                <p className="text-[11px] sm:text-sm text-gray-400">Total Spent</p>
                <h4 className="text-sm sm:text-lg font-semibold text-yellow-300">
                  ₹{spent.toFixed(2)}
                </h4>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-full bg-yellow-500/20 text-yellow-400">
                <MdAddShoppingCart size={22} />
              </div>
              <div>
                <p className="text-[11px] sm:text-sm text-gray-400">Total Orders</p>
                <h4 className="text-sm sm:text-lg font-semibold text-yellow-300">
                  {orders}
                </h4>
              </div>
            </div>
          </Card>
        </section>

        {/* ================= CATEGORY FILTER ================= */}
        <CategoryFilter />

        {/* ================= QUICK ACTIONS ================= */}
        <section className="w-full">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-yellow-400 tracking-wide text-center lg:text-left">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 max-w-6xl mx-auto px-2 lg:px-0">
            {quickActions.map((action, idx) => (
              <Card
                key={idx}
                onClick={() => (window.location.href = action.href)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 lg:py-5 text-yellow-300 transition-all cursor-pointer bg-[#151517] border border-yellow-500/20 rounded-2xl hover:scale-105 ${
                  action.neon
                    ? "hover:shadow-[0_0_25px_rgba(255,255,0,0.6)] hover:bg-yellow-500/10"
                    : "hover:bg-yellow-500/10 hover:shadow-[0_0_12px_rgba(234,179,8,0.25)]"
                }`}
              >
                <div
                  className={`text-yellow-400 ${
                    action.neon
                      ? "drop-shadow-[0_0_8px_rgba(255,255,0,0.8)] animate-pulse"
                      : ""
                  }`}
                >
                  {action.icon}
                </div>
                <span className="text-sm sm:text-base font-medium text-center">
                  {action.label}
                </span>
              </Card>
            ))}
          </div>
        </section>

        {/* ================= ORDER FORM / DISABLED MESSAGE ================= */}
        {serviceEnabled ? (
          <OrderForm />
        ) : (
          <div className="flex flex-col items-center justify-center text-center px-6 py-10">
            <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-10 max-w-md shadow-[0_0_25px_rgba(234,179,8,0.08)]">
              <FaTools className="text-yellow-400 text-5xl mx-auto mb-4 animate-pulse" />
              <h1 className="text-2xl font-semibold text-yellow-400 mb-2">
                Services Temporarily Unavailable
              </h1>
              <p className="text-gray-300 leading-relaxed">
                Our order section is currently disabled by the administrator for
                maintenance or updates.
                <br /> Please check back later.
              </p>
              <p className="text-sm text-gray-500 mt-3 italic">
                We’ll be back soon — thank you for your patience!
              </p>
            </div>
          </div>
        )}

        {/* ================= LATEST ORDERS ================= */}
        <LatestOrders />

        {/* ================= OTHER SECTIONS ================= */}
        <SupportSection />
        <Announcements />
      </div>
    </div>
  );
}


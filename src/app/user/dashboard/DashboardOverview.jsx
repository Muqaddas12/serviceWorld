"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  MdAddShoppingCart,
  MdAccountBalanceWallet,
  MdSupportAgent,
  MdTrendingUp,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-[#151517] border border-yellow-500/20 rounded-2xl shadow-md p-5 hover:border-yellow-500/40 transition-all ${className}`}
  >
    {children}
  </div>
);

export default function DashboardLayout({ user }) {
  const [balance, setBalance] = useState(0);
  const [spent, setSpent] = useState(0);
  const [orders, setOrders] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch("/api/services/getbalance", { cache: "no-store" });
        const data = await res.json();
        if (data.success) setBalance(data.balance);
      } catch (err) {
        console.error("Balance fetch error:", err);
      }
    }
    fetchBalance();
  }, []);

  // Example static data
  useEffect(() => {
    setSpent(1245.75);
    setOrders(689);
  }, []);

  const quickActions = [
    {
      icon: <MdAddShoppingCart size={28} />,
      label: "New Order",
      href: "/user/dashboard",
    },
    {
      icon: <MdAccountBalanceWallet size={28} />,
      label: "Add Funds",
      href: "/user/addfunds",
    },
    {
      icon: <MdSupportAgent size={28} />,
      label: "Support",
      href: "/user/support",
    },
  ];

  const latestOrders = [
    { id: "#1324", service: "Instagram Followers", amount: "₹350", status: "Completed" },
    { id: "#1323", service: "YouTube Views", amount: "₹220", status: "Processing" },
    { id: "#1322", service: "Twitter Likes", amount: "₹90", status: "Pending" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0e0e0f] text-gray-100 p-4 sm:p-6 space-y-8">
      {/* ================= STATS ================= */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-400">
              <FaUserCircle size={26} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Username</p>
              <h4 className="text-lg font-semibold text-yellow-300">
                {user?.username || "Guest"}
              </h4>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-400">
              <MdAccountBalanceWallet size={26} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Balance</p>
              <h4 className="text-lg font-semibold text-yellow-300">
                ₹{balance.toFixed(2)}
              </h4>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-400">
              <MdTrendingUp size={26} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Spent</p>
              <h4 className="text-lg font-semibold text-yellow-300">
                ₹{spent.toFixed(2)}
              </h4>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-400">
              <MdAddShoppingCart size={26} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Orders</p>
              <h4 className="text-lg font-semibold text-yellow-300">{orders}</h4>
            </div>
          </div>
        </Card>
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-yellow-400 tracking-wide">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <Card
              key={idx}
              className="flex items-center justify-center gap-3 py-5 cursor-pointer hover:bg-yellow-500/10 text-yellow-300"
              onClick={() => (window.location.href = action.href)}
            >
              {action.icon}
              <span className="font-medium">{action.label}</span>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= LATEST ORDERS ================= */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-yellow-400 tracking-wide">
          Latest Orders
        </h3>
        <Card>
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase border-b border-yellow-500/20 text-yellow-400">
              <tr>
                <th className="py-3 px-2 sm:px-4">Order ID</th>
                <th className="py-3 px-2 sm:px-4">Service</th>
                <th className="py-3 px-2 sm:px-4">Amount</th>
                <th className="py-3 px-2 sm:px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order, idx) => (
                <tr key={idx} className="border-b border-yellow-500/10 hover:bg-yellow-500/5">
                  <td className="py-3 px-2 sm:px-4">{order.id}</td>
                  <td className="py-3 px-2 sm:px-4">{order.service}</td>
                  <td className="py-3 px-2 sm:px-4 text-yellow-300">{order.amount}</td>
                  <td className="py-3 px-2 sm:px-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        order.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "Processing"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      {/* ================= ANNOUNCEMENTS ================= */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-yellow-400 tracking-wide">
          Announcements
        </h3>
        <Card>
          <p className="text-gray-300 leading-relaxed">
            🎉 Welcome to <span className="text-yellow-400 font-semibold">InstantSMM</span>!
            Get the best social media services at lightning speed.
            <br />
            💳 Add funds to your account and start placing orders instantly.
            <br />
            📩 Need help? Visit our <span className="text-yellow-400">Support</span> section.
          </p>
        </Card>
      </section>
    </div>
  );
}

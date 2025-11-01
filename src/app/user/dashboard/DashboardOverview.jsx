"use client";

import { useEffect, useState } from "react";
import {
  MdAddShoppingCart,
  MdAccountBalanceWallet,
  MdTrendingUp,
  MdSupportAgent,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import Announcements from "./Announcements";
import LatestOrders from "./LatestOrders";
import { getUserBalance, getUserDetails } from "@/lib/userActions";
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

export default function DashboardLayout() {
  const [user, setUser] = useState({});
  const [spent, setSpent] = useState(0);
  const [orders, setOrders] = useState(0);
  const [balance, setBalance] = useState(0);


  useEffect(() => {
    async function getUser() {
      try {
        const data = await getUserDetails();
        if (data) {
          setUser(data);
          setBalance(data.balance || 0);
        }
      } catch (err) {
        console.error("user fetch error:", err);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    setSpent(1245.75);
    setOrders(689);
  }, []);

  const quickActions = [
    {
      icon: <MdAddShoppingCart size={22} />,
      label: "New Order",
      href: "/user/dashboard",
    },
    {
      icon: <MdAccountBalanceWallet size={22} />,
      label: "Add Funds",
      href: "/user/addfunds",
    },

  ];

  return (
    <div className="w-full min-h-screen bg-[#0e0e0f] text-gray-100 py-4 sm:py-6 flex justify-center">
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
                  ₹{balance.toFixed(2)}
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

         {/* ================= QUICK ACTIONS ================= */}
        <section>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-yellow-400 tracking-wide">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {quickActions.map((action, idx) => (
              <Card
                key={idx}
                onClick={() => (window.location.href = action.href)}
                className={`flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 lg:py-5 text-yellow-300 transition-all ${
                  action.neon
                    ? "hover:shadow-[0_0_20px_rgba(255,255,0,0.7)] hover:bg-yellow-500/10"
                    : "hover:bg-yellow-500/10"
                }`}
              >
                <div
                  className={`text-yellow-400 ${
                    action.neon
                      ? "drop-shadow-[0_0_6px_rgba(255,255,0,0.8)] animate-pulse"
                      : ""
                  }`}
                >
                  {action.icon}
                </div>
                <span className="text-sm sm:text-base font-medium">{action.label}</span>
              </Card>
            ))}
          </div>
        </section>

 <LatestOrders />
<CategoryFilter/>

<OrderForm />

        
       

        {/* ================= OTHER SECTIONS ================= */}
       <SupportSection/>
        <Announcements />
        <SupportSection/>
      </div>
    </div>
  );
}

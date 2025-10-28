"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { MdDashboard, MdHistory, MdPayment, MdHelp } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import clsx from "clsx";

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: <MdDashboard />, text: "New Order", href: "/user/dashboard" },
    { icon: <MdHistory />, text: "Services", href: "/user/services" },
    { icon: <MdHistory />, text: "Orders History", href: "/user/orders" },
    { icon: <MdPayment />, text: "Add Funds", href: "/user/addfunds" },
    { icon: <MdHelp />, text: "Tickets Support", href: "/user/support" },
  ];

  // 🔹 Fetch user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/uploadProfile", {
          headers: { "x-user-email": localStorage.getItem("email") },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    }
    fetchUser();
  }, []);

  // 🔹 Fetch user balance
  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch("/api/services/getbalance");
        const data = await res.json();
        if (data.success) setBalance(data.balance);
      } catch (err) {
        console.error("Balance fetch error:", err);
      }
    }
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.ok) {
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        router.push("/auth/login");
      } else {
        console.error("Logout failed:", await res.text());
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Something went wrong during logout.");
    }
  };

  return (
    <aside
      className={clsx(
        "fixed md:static top-0 left-0 z-50 h-full md:h-auto md:flex flex-col transition-all duration-300 shadow-2xl",
        "bg-gradient-to-b from-purple-500 via-indigo-500 to-pink-500 text-white",
        isSidebarOpen
          ? "translate-x-0 w-64"
          : "-translate-x-full md:translate-x-0 md:w-auto"
      )}
      style={{
        width: isCollapsed ? "70px" : "260px",
        transition: "width 0.3s ease",
      }}
    >
      {/* 🔹 Hamburger Menu */}
      <div className="flex justify-end p-3">
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              setIsSidebarOpen(!isSidebarOpen);
            } else {
              setIsCollapsed(!isCollapsed);
            }
          }}
          className="bg-white text-black p-2 rounded-full shadow-md hover:opacity-90 transition"
        >
          <FaBars />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {/* User Info */}
        {!isCollapsed && (
          <div className="flex flex-col items-center py-6 border-b border-white/20">
            <label className="cursor-pointer relative">
              <input type="file" accept="image/*" className="hidden" />
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className={`w-20 h-20 rounded-full object-cover border-2 border-white ${
                    uploading ? "opacity-50 animate-pulse" : ""
                  }`}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <FaUserCircle size={40} />
                </div>
              )}
            </label>
            <h2 className="text-lg font-semibold mt-2">
              {user?.username || "Guest"}
            </h2>
            <p className="text-sm text-white/80">
              Balance: ₹{balance.toFixed(2)}
            </p>
          </div>
        )}

        {/* Menu */}
        <nav className="mt-6 space-y-2 px-3">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <div
                key={idx}
                onClick={() => {
                  router.push(item.href);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors duration-200 ${
                  isActive ? "bg-white text-black shadow-lg" : "hover:bg-white/20"
                }`}
              >
                {item.icon}
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap">
                    {item.text}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* 🔹 Logout Button */}
      {!isCollapsed && (
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 m-4 py-2 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition"
        >
          <FiLogOut /> Logout
        </button>
      )}
    </aside>
  );
}

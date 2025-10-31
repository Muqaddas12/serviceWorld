"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUserCircle,
  FaTimesCircle,
  FaBars,
} from "react-icons/fa";
import {
  MdDashboard,
  MdHistory,
  MdPayment,
  MdHelp,
} from "react-icons/md";
import { FiLogOut, FiSettings } from "react-icons/fi";
import clsx from "clsx";
import Link from "next/link";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: <MdDashboard />, text: "New Order", href: "/user/dashboard" },
    { icon: <MdHistory />, text: "Services", href: "/user/services" },
    { icon: <MdHistory />, text: "Orders History", href: "/user/orders" },
    { icon: <MdPayment />, text: "Add Funds", href: "/user/addfunds" },
    { icon: <MdHelp />, text: "Tickets Support", href: "/user/support" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        router.push("/auth/login");
      } else alert("Logout failed. Please try again.");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <main className="flex h-screen bg-[#0e0e0f] text-gray-100 overflow-hidden">

      {/* 🔹 Overlay (for all screens) */}
      {isSidebarOpen && (
        <div
          className="fixed bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={clsx(
          "fixed z-50 flex flex-col w-64 h-full bg-gradient-to-b from-[#0d0d0f] via-[#1c1c1e] to-[#2b2b2d] text-gray-100 shadow-2xl transition-transform duration-300 border-r border-yellow-500/20",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-yellow-500/20">
          <h1 className="text-lg font-semibold tracking-wide text-yellow-400">
            Navigation
          </h1>
          <button
            className="p-2 rounded-lg hover:bg-yellow-500/10 transition"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimesCircle size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center gap-2 px-4 py-6 border-b border-yellow-500/20">
          <div className="w-20 h-20 rounded-full bg-yellow-400/20 flex items-center justify-center shadow-md overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUserCircle size={60} className="text-yellow-400/80" />
            )}
          </div>
          <h2 className="text-lg font-semibold mt-2 text-yellow-300">
            {user?.username || "Guest"}
          </h2>
          <p className="text-sm text-gray-400">
            Balance: ₹{balance.toFixed(2)}
          </p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <div
                key={idx}
                onClick={() => {
                  router.push(item.href);
                  setIsSidebarOpen(false);
                }}
                className={clsx(
                  "flex items-center gap-3 p-3 rounded-xl cursor-pointer font-medium transition-all duration-200",
                  isActive
                    ? "bg-yellow-500/20 text-yellow-400 shadow-md"
                    : "hover:bg-yellow-500/10 text-gray-300"
                )}
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-yellow-500/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 justify-center bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-semibold py-2 rounded-xl transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* 🔹 Main Section */}
      <div
        className={clsx(
          "flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300 bg-[#0e0e0f]"
        )}
      >
        {/* Header */}
        <header
          className={clsx(
            "flex items-center justify-between px-4 py-3 sticky top-0 z-30 transition-all duration-300",
            "bg-[#111112]/90 backdrop-blur-lg border-b border-yellow-500/10",
            scrolled && "shadow-lg"
          )}
        >
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition"
            >
              <FaBars size={20} />
            </button>
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold text-yellow-400 tracking-wide"
            >
              InstantSMM
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 relative">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm text-gray-400">Balance</span>
              <span className="text-lg font-bold text-yellow-400">
                ₹{balance.toFixed(2)}
              </span>
            </div>

            {/* User Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition"
            >
              <FaUserCircle size={22} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-[#1b1b1c] text-gray-100 rounded-xl shadow-lg border border-yellow-500/20 overflow-hidden z-50">
                <button
                  className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-500/10 w-full text-sm"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/user/settings");
                  }}
                >
                  <FiSettings /> Settings
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-yellow-500/10 w-full text-sm"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 text-gray-100">
          {children}
        </div>
      </div>
    </main>
  );
}

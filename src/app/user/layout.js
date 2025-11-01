"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUserCircle,
  FaTimesCircle,
  FaBars,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { MdDashboard, MdHistory, MdPayment, MdHelp } from "react-icons/md";
import { FiLogOut, FiSettings } from "react-icons/fi";
import clsx from "clsx";
import Link from "next/link";
import {
  getUserBalance,
  getUserDetails,
  uploadProfilePicture,
} from "@/lib/userActions";
import { logoutUser } from "@/lib/authentication";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // 🌙 Dark mode state
  const [currency, setCurrency] = useState("INR"); // 💱 Currency selector
  const fileInputRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: <MdDashboard />, text: "New Order", href: "/user/dashboard" },
    { icon: <MdHistory />, text: "Services", href: "/user/services" },
    { icon: <MdHistory />, text: "Orders History", href: "/user/orders" },
    { icon: <MdPayment />, text: "Add Funds", href: "/user/addfunds" },
    { icon: <MdHelp />, text: "Tickets Support", href: "/user/support" },
  ];

  // 🔹 Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Fetch user details
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getUserDetails();
        if (res.success) setUser(res);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    }
    fetchUser();
  }, []);

  // 🔹 Upload profile image
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    const res = await uploadProfilePicture(formData);
    setUploading(false);

    if (res.success) {
      setUser((prev) => ({ ...prev, avatar: res.avatar }));
    } else alert(res.error || "Upload failed");
  };

  // 🔹 Fetch balance (auto refresh every 30s)
  useEffect(() => {
    async function fetchBalance() {
      try {
        const data = await getUserBalance();
        if (data.balance) setBalance(data.balance);
      } catch (err) {
        console.error("Balance fetch error:", err);
      }
    }
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (!res.error) {
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        router.push("/auth/login");
      } else alert("Logout failed. Please try again.");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // 🌙 Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <main
      className={clsx(
        "flex h-screen text-gray-100 overflow-hidden transition-colors duration-500",
        darkMode ? "bg-[#0b0b0c]" : "bg-[#0e0e0f]"
      )}
    >
      {/* 🔹 Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed bg-black/50 z-40 inset-0"
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
        {/* Header */}
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

        {/* Profile Section */}
        <div className="flex flex-col items-center gap-2 px-4 py-6 border-b border-yellow-500/20">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full bg-yellow-400/20 flex items-center justify-center shadow-md overflow-hidden cursor-pointer relative group"
            onClick={() => fileInputRef.current?.click()}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className={`w-full h-full object-cover ${
                  uploading ? "opacity-50" : ""
                }`}
              />
            ) : (
              <FaUserCircle
                size={60}
                className={`text-yellow-400/80 ${uploading ? "opacity-50" : ""}`}
              />
            )}
            <div className="absolute inset-0 bg-black/40 text-xs text-yellow-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading ? "Uploading..." : "Change Photo"}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Username */}
          <h2 className="text-lg font-semibold mt-2 text-yellow-300">
            {user?.username || "Guest"}
          </h2>

          {/* Balance */}
          <p className="text-sm text-gray-400">
            Balance: {currency === "USD" ? "$" : "₹"}
            {balance.toFixed(2)}
          </p>

          {/* 💱 Currency Selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-2 bg-[#1c1c1e] text-gray-200 border border-yellow-500/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-yellow-400"
          >
            <option value="INR">INR ₹</option>
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
          </select>
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

        {/* Logout */}
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
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300">
        {/* Header */}
        <header
          className={clsx(
            "flex items-center justify-between px-4 py-3 sticky top-0 z-30 bg-[#111112]/90 backdrop-blur-lg border-b border-yellow-500/10",
            scrolled && "shadow-lg"
          )}
        >
          {/* Left */}
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

          {/* Right */}
          <div className="flex items-center gap-4 relative">
            {/* 🌙 Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 transition"
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm text-gray-400">Balance</span>
              <span className="text-lg font-bold text-yellow-400">
                {currency === "USD" ? "$" : "₹"}
                {balance.toFixed(2)}
              </span>
            </div>

            {/* Profile Menu */}
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

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto md:p-6">{children}</div>
      </div>
    </main>
  );
}

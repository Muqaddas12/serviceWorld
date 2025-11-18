"use client";

import Link from "next/link";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { FaBars, FaSun, FaMoon, FaUserCircle } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";

export default function Header({
  dark = true,
  user,
  isSidebarOpen,
  setIsSidebarOpen,
  menuOpen,
  setMenuOpen,
  handleLogout,
  toggleDarkMode,
  currency = "INR",
  websitename = "MyWebsite",
}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "flex items-center justify-between px-4 py-3 sticky top-0 z-30 backdrop-blur-lg transition-all border-b",

        /* DARK MODE */
        "dark:bg-[#0F1117]/90 dark:text-white dark:border-gray-700",

        /* LIGHT MODE */
        "bg-white/90 text-gray-700 border-gray-300",

        scrolled && "shadow-xl shadow-black/10 dark:shadow-black/30"
      )}
    >
      {/* LEFT section */}
      <div className="flex items-center gap-3">

        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="
            p-2 rounded-lg transition

            /* Dark */
            dark:bg-white/10 dark:text-white dark:hover:bg-white/20

            /* Light */
            bg-gray-100 text-gray-700 hover:bg-gray-200
          "
        >
          <FaBars size={20} />
        </button>

        {/* Website Title */}
        <Link
          href="/"
          className="
            text-xl sm:text-2xl font-bold tracking-wide

            /* Dark */
            dark:text-white

            /* Light */
            text-gray-700
          "
        >
          {websitename.siteName}
        </Link>
      </div>

      {/* RIGHT Section */}
      <div className="flex items-center gap-4 relative">

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="
            p-2 rounded-full transition

            /* Dark */
            dark:bg-white/10 dark:text-white dark:hover:bg-white/20

            /* Light */
            bg-gray-100 text-gray-700 hover:bg-gray-200
          "
        >
          {dark ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>

        {/* Balance */}
        {user?.balance != null && (
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm dark:text-gray-300 text-gray-500">
              Balance
            </span>
            <span className="text-lg font-bold text-green-500">
              {currency === "USD" ? "$" : "₹"}
              {Number(user.balance).toFixed(2)}
            </span>
          </div>
        )}

        {/* Profile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
            flex items-center justify-center w-10 h-10 rounded-full transition

            /* Dark */
            dark:bg-white/10 dark:text-white dark:hover:bg-white/20

            /* Light */
            bg-gray-100 text-gray-700 hover:bg-gray-200
          "
        >
          <FaUserCircle size={22} />
        </button>

        {/* DROPDOWN */}
        {menuOpen && (
          <div
            className="
              absolute right-0 top-12 w-48 rounded-xl overflow-hidden z-50
              border shadow-lg transition

              /* Dark */
              dark:bg-[#1A1F2B] dark:border-gray-700 dark:text-white

              /* Light */
              bg-white border-gray-200 text-gray-700
            "
          >
            {/* Settings */}
            <button
              className="
                flex items-center gap-2 px-4 py-2 w-full text-sm transition

                /* Dark */
                dark:hover:bg-white/10

                /* Light */
                hover:bg-gray-100
              "
              onClick={() => {
                setMenuOpen(false);
                router.push("/user/settings");
              }}
            >
              <FiSettings className="text-gray-700 dark:text-white" />
              Settings
            </button>

            {/* Logout */}
            <button
              className="
                flex items-center gap-2 px-4 py-2 w-full text-sm text-red-500 transition

                /* Dark */
                dark:hover:bg-red-500/10

                /* Light */
                hover:bg-red-100
              "
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
            >
              <FiLogOut className="dark:text-red-400" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

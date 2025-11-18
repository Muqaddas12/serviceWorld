"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Bell, User, LogOut, Settings } from "lucide-react";
import { logoutUser } from "@/lib/authentication";
import ThemeSwitcher from "../components/ThemeSwitcher";
const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Services", path: "/admin/services" },
  { name: "Users", path: "/admin/users" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Payments", path: "/admin/payments" },
  { name: "Tickets", path: "/admin/tickets" },
  { name: "Settings", path: "/admin/settings" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname.includes("admin/login")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-[#0F1117] text-gray-800 dark:text-gray-200">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#1A1F2B] border-b border-gray-300 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-5 py-3">

          {/* Logo & Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white md:hidden"
            >
              {openMenu ? <X size={22} /> : <Menu size={22} />}
            </button>

            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Admin Panel
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm transition ${
                  pathname === item.path
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Profile Menu */}
          <div className="flex items-center gap-4 relative">

            {/* Notifications */}
            {/* <button className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-gray-700 dark:bg-gray-300 rounded-full"></span>
            </button> */}
            <ThemeSwitcher/>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-[#0F1117] px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                <User size={18} />
                <span className="hidden md:inline text-sm font-medium">
                  Admin
                </span>
              </button>

              {openProfile && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-[#1A1F2B] border border-gray-300 dark:border-gray-700 shadow-xl overflow-hidden">

                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <Settings size={16} /> Settings
                  </Link>

                  <button
                    onClick={async () => await logoutUser()}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {openMenu && (
          <div
            ref={menuRef}
            className="md:hidden bg-white dark:bg-[#1A1F2B] border-t border-gray-300 dark:border-gray-700 flex flex-col px-3 py-2 space-y-1"
          >
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpenMenu(false)}
                className={`block px-3 py-2 rounded-md text-sm transition ${
                  pathname === item.path
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}

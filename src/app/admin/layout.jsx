"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Bell, User, LogOut, Settings } from "lucide-react";
import { logoutUser } from "@/lib/authentication";

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
    <div className="min-h-screen bg-[#0e0e0f] text-gray-300 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#151517] border-b border-yellow-500/20 shadow-md">
        <div className="flex items-center justify-between px-5 py-3">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="text-gray-400 hover:text-yellow-400 md:hidden"
            >
              {openMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="text-lg font-bold text-yellow-400">SMM Admin</h1>
          </div>

          {/* Center: Navigation (desktop) */}
          <nav className="hidden md:flex items-center gap-5">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  pathname === item.path
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                    : "hover:text-yellow-400 hover:bg-[#1d1d1f]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-4 relative">
            <button className="relative text-gray-400 hover:text-yellow-400">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </button>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setOpenProfile((p) => !p)}
                className="flex items-center gap-2 bg-[#0e0e0f] hover:bg-[#1d1d1f] px-3 py-2 rounded-full border border-yellow-500/20"
              >
                <User size={18} className="text-yellow-400" />
                <span className="hidden md:inline text-sm font-medium text-gray-300">
                  Admin
                </span>
              </button>

              {openProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-[#151517] border border-yellow-500/20 rounded-lg shadow-xl overflow-hidden">
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#1d1d1f] hover:text-yellow-400 text-sm"
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  <button
                    onClick={async () => await logoutUser()}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-[#1d1d1f] hover:text-red-300 text-sm"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {openMenu && (
          <div
            ref={menuRef}
            className="md:hidden bg-[#151517] border-t border-yellow-500/20 flex flex-col px-3 py-2 space-y-1"
          >
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpenMenu(false)}
                className={`block px-3 py-2 rounded-md text-sm transition ${
                  pathname === item.path
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                    : "hover:text-yellow-400 hover:bg-[#1d1d1f]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

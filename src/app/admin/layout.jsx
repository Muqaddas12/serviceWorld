"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Bell, User, LogOut, Settings } from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Services", path: "/admin/services" },
  { name: "Users", path: "/admin/users" },
  { name: "Payments", path: "/admin/payments" },
  { name: "Tickets", path: "/admin/tickets" },
  { name: "Settings", path: "/admin/settings" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // if click outside of profile → close it
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }

      // if click outside of sidebar & not the menu button → close sidebar
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.closest(".menu-toggle")
      ) {
        setOpenSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname.includes("admin/login")) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#0e0e0f] text-gray-300">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
        bg-[#151517] border-r border-yellow-500/20 shadow-xl
        ${openSidebar ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-yellow-500/20">
          <h1 className="text-lg font-bold text-yellow-400">SMM Admin</h1>
          <button
            onClick={() => setOpenSidebar(false)}
            className="text-gray-400 hover:text-yellow-400 md:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-5 space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpenSidebar(false)}
              className={`block px-5 py-2.5 rounded-lg font-medium transition
                ${
                  pathname === item.path
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                    : "hover:bg-[#1d1d1f] hover:text-yellow-400"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay (mobile only) */}
      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#151517] border-b border-yellow-500/20 shadow-md flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu */}
            <button
              onClick={() => setOpenSidebar(!openSidebar)}
              className="menu-toggle text-gray-400 hover:text-yellow-400 transition md:hidden"
            >
              {openSidebar ? <X size={22} /> : <Menu size={22} />}
            </button>

            <h2 className="text-lg font-semibold text-yellow-400">
              Admin Panel
            </h2>
          </div>

          {/* Right Icons */}
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
                    onClick={() => alert("Logout clicked")}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-[#1d1d1f] hover:text-red-300 text-sm"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

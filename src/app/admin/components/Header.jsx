"use client";

import { Menu, Bell, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Header({ setOpen }) {
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white shadow flex items-center justify-between px-4 py-3 border-b border-gray-200">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-gray-700"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-gray-800">
          <Bell size={22} />
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpenProfile((prev) => !prev)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full"
          >
            <User size={20} className="text-gray-700" />
            <span className="hidden md:inline text-sm font-medium text-gray-700">
              Admin
            </span>
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md border rounded-md overflow-hidden">
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
              >
                <Settings size={16} /> Settings
              </Link>
              <button
                className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600 text-sm"
                onClick={() => alert("Logout clicked")}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

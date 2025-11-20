"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MdDashboard,
  MdHistory,
  MdPayment,
  MdHelp,
  MdInventory,
  MdLink,
  MdDns,
} from "react-icons/md";

import { logoutUser } from "@/lib/authentication";
import Sidebar from "./Sidebar";
import Header from "./Header";
import clsx from "clsx";

export default function Page({ user, children, websiteName }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Read theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // 🌙 Toggle Theme
  const toggleDarkMode = () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  // 🧭 Sidebar Menu Items (unchanged)
  const menuItems = [
    { icon: <MdDashboard />, text: "New Order", href: "/user/dashboard" },
    { icon: <MdInventory />, text: "Mass Order", href: "/user/mass-order" },
    { icon: <MdHistory />, text: "Services", href: "/user/services" },
    { icon: <MdHistory />, text: "Orders History", href: "/user/orders" },
    { icon: <MdPayment />, text: "Add Funds", href: "/user/addfunds" },
    { icon: <MdHelp />, text: "Tickets Support", href: "/user/support" },
    { icon: <MdLink />, text: "Referral", href: "/user/referral" },
    { icon: <MdLink />, text: "Api", href: "/user/api" },
    { icon: <MdDns />, text: "Child Panel", href: "/user/child-panel" },
  ];

  // 🚪 Logout
  const handleLogout = async () => {
    const res = await logoutUser();
    if (!res.error) {
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      router.replace("/auth/login");
    }
  };

  return (
    <main
      className={clsx(
        "flex h-screen overflow-hidden transition-colors duration-500",

        // Light Mode
        "bg-gray-100 text-gray-800",

        // Dark Mode
        "dark:bg-[#0F1117] dark:text-white"
      )}
    >
      {/* 🔹 Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🔹 Sidebar */}
      <Sidebar
        menuItems={menuItems}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        user={user}
        darkMode={false} // Sidebar now uses pure .dark classes inside, no prop needed
      />

      {/* 🔹 Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <Header
          user={user}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleLogout={handleLogout}
          toggleDarkMode={toggleDarkMode}
          websitename={websiteName}
        />

        {/* Content Wrapper */}
        <div
          className="
          flex-1 overflow-y-auto md:p-6 
          bg-gray-100 text-gray-800
          dark:bg-[#0F1117] dark:text-white
        "
        >
          {children}
        </div>
      </div>
    </main>
  );
}

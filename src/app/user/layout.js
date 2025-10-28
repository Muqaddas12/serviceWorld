"use client";
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function UserLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* 🔹 Header */}
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* 🔹 Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden bg-white">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
}

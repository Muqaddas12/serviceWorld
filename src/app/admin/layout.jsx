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
console.log(pathname)
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
    <> 
    {pathname.includes('admin/login')?(
      <>{children} </>
    ):(
      <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
 <aside
  className={`fixed inset-y-0 left-0 z-40 w-64 text-white transform md:translate-x-0 transition-transform duration-200
    bg-gradient-to-b from-purple-700 via-indigo-700 to-blue-700
    ${openSidebar ? "translate-x-0" : "-translate-x-full"}`}
>
  <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
    <h1 className="text-xl font-bold">SMM Admin</h1>
    <button
      onClick={() => setOpenSidebar(false)}
      className="md:hidden text-white hover:text-gray-200"
    >
      <X size={22} />
    </button>
  </div>

  <nav className="mt-4">
    {menuItems.map((item) => (
     <Link
        key={item.path}
        href={item.path}
        className={`block px-6 py-3 text-sm font-medium rounded-md mb-1
          ${
            pathname === item.path
              ? "bg-white/20 text-white"
              : "hover:bg-white/10 text-white"
          }`}
      >
        {item.name}
      </Link>
    ))}
  </nav>
</aside>


      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64"> 
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenSidebar(true)}
              className="md:hidden text-gray-700"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              Admin Panel
            </h2>
          </div>

          <div className="flex items-center gap-4 relative">
            <button className="relative text-gray-600 hover:text-gray-800">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

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

       
        <main className="flex-2 p-2">{children}</main>
      </div>
    </div>
    )}  
     
    </>

  );
}

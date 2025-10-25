"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

export default function Sidebar({ open, setOpen }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Services", path: "/admin/services" },
    { name: "Users", path: "/admin/users" },
    { name: "Payments", path: "/admin/payments" },
    { name: "Tickets", path: "/admin/tickets" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform md:translate-x-0 transition-transform duration-200 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h1 className="text-xl font-bold">SMM Admin</h1>
        <button
          onClick={() => setOpen(false)}
          className="md:hidden text-gray-300 hover:text-white"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-6 py-3 text-sm font-medium ${
              pathname === item.path
                ? "bg-gray-800 text-blue-400"
                : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

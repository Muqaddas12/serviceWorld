"use client";

import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import clsx from "clsx";
import { logoutUser } from "@/lib/authentication";
import { uploadProfilePicture } from "@/lib/userActions";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  user,
  menuItems,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [currency, setCurrency] = useState("INR");

  // Upload profile pic
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    const res = await uploadProfilePicture(formData);
    setUploading(false);

    if (res.success) router.refresh();
    else alert(res.error || "Upload failed");
  };

  return (
    <aside
      className={clsx(
        "fixed z-50 flex flex-col w-64 h-full transition-transform duration-300 shadow-2xl border-r",

        /* Light Mode */
        "bg-white border-gray-300 text-gray-800",

        /* Dark Mode */
        "dark:bg-[#0F1117] dark:border-gray-800 dark:text-white",

        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Profile Section */}
      <div
        className={clsx(
          "flex flex-col items-center gap-2 px-4 py-6 border-b",
          "border-gray-300 dark:border-gray-800"
        )}
      >
        {/* Avatar */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            "w-20 h-20 rounded-full flex items-center justify-center cursor-pointer group relative overflow-hidden",

            /* Light */
            "bg-gray-200 text-gray-700",

            /* Dark */
            "dark:bg-white/10 dark:text-white"
          )}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className={`w-full h-full object-cover ${
                uploading ? "opacity-40" : ""
              }`}
            />
          ) : (
            <FaUserCircle size={60} className={uploading ? "opacity-40" : ""} />
          )}

          <div
            className="
              absolute inset-0 bg-black/40 text-xs 
              text-white flex items-center justify-center 
              opacity-0 group-hover:opacity-100 
              transition-opacity
            "
          >
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
        <h2
          className="
            text-lg font-semibold
            text-gray-800 dark:text-white
          "
        >
          {user?.username || "Guest"}
        </h2>

        {/* Balance + Currency */}
        <div className="flex items-center gap-3">
          {user?.balance != null && (
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Balance: {currency === "USD" ? "$" : "₹"}
              {Number(user.balance).toFixed(2)}
            </p>
          )}

          {/* Currency Selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="
              rounded-lg px-3 py-1 text-sm focus:outline-none
              bg-white text-gray-700 border border-gray-300 focus:border-gray-500
              dark:bg-[#1A1F2B] dark:text-gray-300 dark:border-gray-700 dark:focus:border-gray-500
            "
          >
            <option value="INR">INR ₹</option>
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
          </select>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3 overflow-y-auto">
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
      "flex items-center gap-3 p-3 cursor-pointer font-medium text-sm transition-all",

      // ACTIVE item (text only)
      isActive &&
        `
        text-gray-900 
        dark:text-white
      `,

      // INACTIVE item
      !isActive &&
        `
        text-gray-600 hover:text-gray-900
        dark:text-gray-400 dark:hover:text-white
      `
    )}
  >
    <span className="text-lg">{item.icon}</span>
    <span>{item.text}</span>
  </div>
);

        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-800">
        <button
          onClick={logoutUser}
          className="
            w-full flex items-center gap-3 justify-center font-semibold py-2 rounded-xl transition
            bg-red-100 text-red-600 hover:bg-red-200
            dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30
          "
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
}
